"use client";

import { useRef, useState } from "react";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import { CONSENT_VERSION, formatPhone, normalizePhone } from "@/lib/phone";

export function RegistrationForm({ ready }: { ready: boolean }) {
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);
  const successHeading = useRef<HTMLHeadingElement>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setError("");
    setFieldError("");
    if (!normalizePhone(phone)) {
      setFieldError("010으로 시작하는 휴대폰 번호 11자리를 입력해 주세요.");
      input.current?.focus();
      return;
    }
    if (!consent) {
      setError("출시 소식을 받으려면 개인정보 수집·이용에 동의해 주세요.");
      return;
    }
    const company = new FormData(event.currentTarget).get("company");
    inFlight.current = true;
    setStatus("loading");
    try {
      const response = await fetch("/api/preregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          consent,
          consentVersion: CONSENT_VERSION,
          company,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true)
        throw new Error(
          result?.message || "잠시 연결이 원활하지 않아요. 다시 시도해 주세요.",
        );
      setPhone("");
      setStatus("success");
      setTimeout(() => successHeading.current?.focus(), 0);
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name !== "TimeoutError"
          ? cause.message
          : "연결이 지연되고 있어요. 잠시 후 다시 시도해 주세요.",
      );
      setStatus("idle");
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "success")
    return (
      <div className="signup-card signup-success" role="status">
        <span className="success-icon">
          <CheckCircle2 size={38} aria-hidden="true" />
        </span>
        <p className="eyebrow">YOU’RE ON THE LIST</p>
        <h3 ref={successHeading} tabIndex={-1}>
          우리, 곧 만나요.
        </h3>
        <p>
          사전등록이 완료되었어요.
          <br />
          출시 소식은 남겨주신 번호로 알려드릴게요.
        </p>
        <span className="success-footnote">
          지금은 등록만 완료되며, 문자는 추후 발송됩니다.
        </span>
        <a className="text-link" href="#experience">
          와루루 더 둘러보기 <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    );

  return (
    <form
      className="signup-card"
      onSubmit={submit}
      noValidate
      aria-label="와루루 사전등록"
      aria-busy={status === "loading"}
    >
      <div className="signup-card-top">
        <span className="eyebrow">YOUR FIRST HELLO</span>
        <span className="small-brand">waruru.</span>
      </div>
      <h3>
        새로운 만남의 시작,
        <br />내 번호 하나면 충분해요.
      </h3>
      <label className="field-label" htmlFor="phone">
        휴대폰 번호
      </label>
      <div className={`phone-field ${fieldError ? "invalid" : ""}`}>
        <span>+82</span>
        <input
          ref={input}
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="010-0000-0000"
          value={phone}
          onChange={(e) => {
            setPhone(formatPhone(e.target.value));
            setFieldError("");
          }}
          maxLength={20}
          disabled={status === "loading"}
          aria-invalid={!!fieldError}
          aria-describedby={fieldError ? "phone-error" : "phone-hint"}
        />
      </div>
      {fieldError ? (
        <p id="phone-error" className="field-error" role="alert">
          {fieldError}
        </p>
      ) : (
        <p id="phone-hint" className="field-hint">
          출시 알림을 받을 국내 휴대폰 번호를 입력해 주세요.
        </p>
      )}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="consent-row">
        <label className="consent-label">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={status === "loading"}
          />
          <span className="custom-check">
            <Check size={13} aria-hidden="true" />
          </span>
          <span>
            <strong>[필수]</strong> 개인정보 수집·이용에 동의합니다.
          </span>
        </label>
        <a
          href="/privacy"
          target="_blank"
          aria-label="개인정보 수집·이용 내용 보기 (새 탭)"
        >
          보기
        </a>
      </div>
      <p className="consent-description">
        출시 알림을 위해 휴대폰 번호를 수집하며, 동의일로부터 최대 1년 보관 후
        삭제합니다.
      </p>
      {!ready && (
        <p className="form-notice">
          사전등록 오픈을 준비하고 있어요. 현재는 신청이 접수되지 않습니다.
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button
        className="button primary-button signup-submit"
        type="submit"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            등록하고 있어요{" "}
            <LoaderCircle
              className="loading-spinner"
              size={19}
              aria-hidden="true"
            />
          </>
        ) : (
          <>
            사전등록하고 출시 소식 받기{" "}
            <ArrowRight size={19} aria-hidden="true" />
          </>
        )}
      </button>
      <p className="privacy-hint">
        <LockKeyhole size={13} aria-hidden="true" />
        출시 안내에만 사용해요. 언제든 동의를 철회할 수 있어요.
      </p>
    </form>
  );
}
