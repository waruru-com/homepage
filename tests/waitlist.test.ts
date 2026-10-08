import test from "node:test";
import assert from "node:assert/strict";
import { CONSENT_VERSION, formatPhone, normalizePhone } from "../src/lib/phone";
import { handleRegistration, isRegistrationReady } from "../src/lib/waitlist";

const env = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "synthetic-server-secret",
  RATE_LIMIT_SECRET: "synthetic-test-hmac-secret",
  PRIVACY_OPERATOR: "Test Operator",
  PRIVACY_CONTACT_EMAIL: "test@example.invalid",
  REGISTRATION_OPEN: "true",
};
const valid = {
  phone: "010-0000-0000",
  consent: true,
  consentVersion: CONSENT_VERSION,
  company: "",
};
function request(body: unknown = valid, headers: Record<string, string> = {}) {
  return new Request("https://waruru.test/api/preregister", {
    method: "POST",
    headers: {
      origin: "https://waruru.test",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}
function mockFetch(result: unknown, status = 200): typeof fetch {
  return (async () => Response.json(result, { status })) as typeof fetch;
}

test("domestic phone normalization, formatting and malformed input", () => {
  assert.equal(normalizePhone("010-1234-5678"), "01012345678");
  assert.equal(normalizePhone("+82 10 1234 5678"), "01012345678");
  assert.equal(formatPhone("01012345678"), "010-1234-5678");
  assert.equal(formatPhone("+82 10 1234 5678"), "010-1234-5678");
  for (const bad of [
    null,
    123,
    "01112345678",
    "0101234567",
    "010123456789",
    "hello01012345678",
    "<01012345678>",
  ])
    assert.equal(normalizePhone(bad), null);
});
test("browser-facing host works when Next uses an internal hostname", async () => {
  const incoming = new Request("http://localhost:3000/api/preregister", {
    method: "POST",
    headers: {
      host: "127.0.0.1:3000",
      origin: "http://127.0.0.1:3000",
      "content-type": "application/json",
    },
    body: JSON.stringify(valid),
  });
  assert.equal(
    (await handleRegistration(incoming, env, mockFetch("registered"))).status,
    200,
  );
});
test("collection requires database, consent identity and explicit enablement", () => {
  assert.equal(isRegistrationReady(env), true);
  for (const key of Object.keys(env))
    assert.equal(isRegistrationReady({ ...env, [key]: "" }), false, key);
  assert.equal(
    isRegistrationReady({ ...env, REGISTRATION_OPEN: "false" }),
    false,
  );
});
test("cross-origin requests are rejected without contacting persistence", async () => {
  const result = await handleRegistration(
    request(valid, { origin: "https://evil.test" }),
    env,
    () => {
      throw Error("must not fetch");
    },
  );
  assert.equal(result.status, 403);
});
test("reject missing or non-boolean consent, stale document and invalid numbers", async () => {
  for (const body of [
    { ...valid, consent: false },
    { ...valid, consent: "true" },
    { ...valid, consentVersion: "old" },
    { ...valid, phone: "123" },
    { ...valid, company: "bot" },
    null,
    [],
  ]) {
    const response = await handleRegistration(request(body), env, () => {
      throw Error("must not fetch");
    });
    assert.equal(response.status, 400);
  }
});
test("oversized and wrong-content-type payloads rejected", async () => {
  assert.equal(
    (
      await handleRegistration(
        request({ ...valid, extra: "x".repeat(2500) }),
        env,
      )
    ).status,
    413,
  );
  assert.equal(
    (
      await handleRegistration(
        request(valid, { "content-type": "text/plain" }),
        env,
      )
    ).status,
    415,
  );
});
test("unconfigured form never reports successful registration", async () => {
  const response = await handleRegistration(request(), {}, () => {
    throw Error("must not fetch");
  });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
});
test("confirmed persistence normalizes phone, hashes IP and uses server credential", async () => {
  let calls = 0;
  const fetcher = (async (
    url: string | URL | Request,
    options?: RequestInit,
  ) => {
    calls++;
    assert.equal(
      url,
      "https://example.supabase.co/rest/v1/rpc/register_waruru_waitlist",
    );
    const payload = JSON.parse(options?.body as string);
    assert.equal(payload.p_phone, "01000000000");
    assert.match(payload.p_ip_hash, /^[0-9a-f]{64}$/);
    assert.ok(!JSON.stringify(payload).includes("203.0.113.10"));
    assert.equal(
      new Headers(options?.headers).get("apikey"),
      env.SUPABASE_SERVICE_ROLE_KEY,
    );
    return Response.json("registered");
  }) as typeof fetch;
  const response = await handleRegistration(
    request(valid, { "x-vercel-forwarded-for": "203.0.113.10" }),
    { ...env, VERCEL: "1" },
    fetcher,
  );
  assert.equal(calls, 1);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(response.headers.get("cache-control"), "no-store");
});
test("missing trusted Vercel IP fails closed", async () => {
  assert.equal(
    (
      await handleRegistration(request(), { ...env, VERCEL: "1" }, () => {
        throw Error("must not fetch");
      })
    ).status,
    503,
  );
});
test("duplicate confirmed registrations have same non-enumerating success response", async () => {
  const first = await handleRegistration(
    request(),
    env,
    mockFetch("registered"),
  );
  const repeat = await handleRegistration(
    request(),
    env,
    mockFetch("registered"),
  );
  assert.deepEqual(await first.json(), await repeat.json());
});
test("persistent rate limit returns retry metadata", async () => {
  const result = await handleRegistration(
    request(),
    env,
    mockFetch("rate_limited"),
  );
  assert.equal(result.status, 429);
  assert.equal(result.headers.get("retry-after"), "600");
});
test("database rejection, ambiguous result and network failure never report success", async () => {
  const networkFailure = (async () => {
    throw Error("sensitive database detail");
  }) as typeof fetch;
  for (const fetcher of [
    mockFetch({ message: "secret" }, 500),
    mockFetch({ ok: true }),
    mockFetch(null),
    networkFailure,
  ]) {
    const response = await handleRegistration(request(), env, fetcher);
    assert.equal(response.status, 503);
    const body = await response.text();
    assert.ok(!body.includes("secret"));
    assert.ok(!body.includes("sensitive"));
  }
});
