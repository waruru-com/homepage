import { createHmac } from "node:crypto";
import { CONSENT_VERSION, normalizePhone } from "./phone";

type Environment = Record<string, string | undefined>;
export function isRegistrationReady(env: Environment) {
  return !!(
    env.SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    env.RATE_LIMIT_SECRET &&
    env.PRIVACY_OPERATOR &&
    env.PRIVACY_CONTACT_EMAIL &&
    env.REGISTRATION_OPEN === "true"
  );
}

function respond(
  status: number,
  body: Record<string, unknown>,
  extraHeaders = {},
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...extraHeaders },
  });
}

export async function handleRegistration(
  request: Request,
  env: Environment,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  // Next may use an internal hostname in request.url. The HTTP Host is the
  // browser-facing host; browsers cannot override it when submitting a form.
  const requestUrl = new URL(request.url);
  const host = request.headers.get("host") || requestUrl.host;
  const protocol = env.VERCEL ? "https:" : requestUrl.protocol;
  if (request.headers.get("origin") !== `${protocol}//${host}`)
    return respond(403, {
      ok: false,
      message: "이 페이지에서 다시 신청해 주세요.",
    });
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return respond(415, {
      ok: false,
      message: "올바른 형식으로 다시 신청해 주세요.",
    });
  if (Number(request.headers.get("content-length") || 0) > 2048)
    return respond(413, { ok: false, message: "입력 내용을 확인해 주세요." });
  let body: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("empty");
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 2048) {
        await reader.cancel();
        return respond(413, {
          ok: false,
          message: "입력 내용을 확인해 주세요.",
        });
      }
      chunks.push(value);
    }
    const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object")
      throw new Error("invalid");
    body = parsed;
  } catch {
    return respond(400, {
      ok: false,
      message: "입력 내용을 확인하고 다시 신청해 주세요.",
    });
  }
  const phone = normalizePhone(body.phone);
  if (!phone)
    return respond(400, {
      ok: false,
      message: "010으로 시작하는 휴대폰 번호 11자리를 입력해 주세요.",
    });
  if (body.consent !== true || body.consentVersion !== CONSENT_VERSION)
    return respond(400, {
      ok: false,
      message: "개인정보 수집·이용 내용을 확인하고 동의해 주세요.",
    });
  if (body.company)
    return respond(400, { ok: false, message: "입력 내용을 확인해 주세요." });
  if (!isRegistrationReady(env))
    return respond(503, {
      ok: false,
      message: "사전등록 오픈을 준비하고 있어요. 조금만 기다려 주세요.",
    });
  // Vercel overwrites this header at its trusted edge. Never store the raw address.
  const ip = env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    : "local-preview";
  if (!ip)
    return respond(503, {
      ok: false,
      message: "잠시 연결이 원활하지 않아요. 다시 시도해 주세요.",
    });
  const ipHash = createHmac("sha256", env.RATE_LIMIT_SECRET!)
    .update(ip)
    .digest("hex");
  try {
    const result = await fetcher(
      `${env.SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/rpc/register_waruru_waitlist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          p_phone: phone,
          p_consent_version: CONSENT_VERSION,
          p_ip_hash: ipHash,
        }),
        signal: AbortSignal.timeout(9000),
        cache: "no-store",
      },
    );
    if (!result.ok)
      return respond(503, {
        ok: false,
        message: "등록을 완료하지 못했어요. 잠시 후 다시 시도해 주세요.",
      });
    const outcome: unknown = await result.json();
    if (outcome === "rate_limited")
      return respond(
        429,
        {
          ok: false,
          message: "신청이 여러 번 접수되었어요. 10분 후 다시 시도해 주세요.",
        },
        { "Retry-After": "600" },
      );
    if (outcome !== "registered")
      return respond(503, {
        ok: false,
        message: "등록을 확인하지 못했어요. 다시 시도해 주세요.",
      });
    return respond(200, { ok: true });
  } catch {
    return respond(503, {
      ok: false,
      message: "잠시 연결이 원활하지 않아요. 다시 시도해 주세요.",
    });
  }
}
