export const CONSENT_VERSION = "2026-10-08.v1";

export function normalizePhone(value: unknown): string | null {
  if (
    typeof value !== "string" ||
    value.length > 30 ||
    !/^[\d\s()+-]+$/.test(value)
  )
    return null;
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("82")) digits = "0" + digits.slice(2);
  return /^010\d{8}$/.test(digits) ? digits : null;
}

export function formatPhone(value: string): string {
  let raw = value.replace(/\D/g, "");
  if (raw.startsWith("8210")) raw = "0" + raw.slice(2);
  const digits = raw.slice(0, 11);
  return [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7, 11)]
    .filter(Boolean)
    .join("-");
}
