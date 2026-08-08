export type PasskeyRecord = {
  id: string;
  friendly_name?: string;
  created_at: string;
  last_used_at?: string;
};

export type AdminAuthError = {
  code?: string;
  message?: string;
  name?: string;
  status?: number;
  cause?: { name?: string };
};

export const adminReturnToStorageKey = "careeros-admin-return-to";

const approvedReturnPrefixes = [
  "/admin",
  "/learning/board",
  "/learning/timeline",
  "/learning/tickets/",
] as const;

export function validateAdminReturnTo(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/admin";
  if (value.includes("\\") || /[\u0000-\u001f\u007f]/.test(value)) return "/admin";

  try {
    const parsed = new URL(value, "https://www.jasonstroup.website");
    const approved = approvedReturnPrefixes.some((prefix) =>
      prefix.endsWith("/") ? parsed.pathname.startsWith(prefix) : parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`),
    );
    return parsed.origin === "https://www.jasonstroup.website" && approved
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : "/admin";
  } catch {
    return "/admin";
  }
}

export function resolveAdminReturnTo(
  search: string,
  storage?: Pick<Storage, "getItem" | "setItem">,
) {
  const requested = new URLSearchParams(search).get("returnTo");
  const stored = storage?.getItem(adminReturnToStorageKey);
  const returnTo = validateAdminReturnTo(requested ?? stored);
  storage?.setItem(adminReturnToStorageKey, returnTo);
  return returnTo;
}

export function isPasskeySupported(environment: {
  PublicKeyCredential?: unknown;
  credentials?: unknown;
}) {
  return Boolean(environment.PublicKeyCredential && environment.credentials);
}

export function isCanonicalPasskeyOrigin(origin: string) {
  return origin === "https://www.jasonstroup.website";
}

export function passkeyErrorMessage(error: AdminAuthError | null | undefined, action: "sign-in" | "register" | "manage") {
  const cancelled = error?.code === "ERROR_CEREMONY_ABORTED"
    || error?.name === "NotAllowedError"
    || error?.cause?.name === "NotAllowedError";
  if (cancelled) return `Passkey ${action === "sign-in" ? "sign-in" : "registration"} was cancelled. No account change was made.`;
  if (error?.code === "passkey_disabled") return "Passkeys are not enabled for this CareerOS origin. Use email recovery.";
  if (error?.code === "webauthn_credential_not_found") return "No registered CareerOS passkey was found. Use email recovery.";
  if (error?.code === "too_many_passkeys") return "This account has reached the passkey limit. Review existing credentials first.";
  if (action === "manage") return "The passkey change could not be saved. Your existing credentials were not changed.";
  return `Passkey ${action === "sign-in" ? "sign-in" : "registration"} failed. Use email recovery if the problem continues.`;
}

export function magicLinkRetrySeconds(error: AdminAuthError | null | undefined) {
  if (!error) return 30;
  if (/30 seconds/i.test(error.message ?? "")) return 30;
  if (error.code === "over_email_send_rate_limit" || /email rate limit exceeded/i.test(error.message ?? "")) return 60 * 60;
  if (error.status === 429) return 60;
  return 15;
}

export function magicLinkNotice(error: AdminAuthError | null | undefined, retrySeconds: number) {
  if (!error) {
    return "If this address is authorized, a secure sign-in link is on its way. Another request will be available shortly.";
  }
  if (retrySeconds >= 60 * 60) {
    return "Supabase's email delivery limit has been reached. Wait up to one hour before requesting another link, or use a registered passkey.";
  }
  if (error.status === 429 || error.code === "over_email_send_rate_limit") {
    return `Email delivery is cooling down. Try again in ${retrySeconds} seconds, or use a registered passkey.`;
  }
  return "The secure sign-in request could not be completed. Check the connection, wait briefly, and try again.";
}

export async function requirePasskeyResult<T>(
  operation: () => Promise<{ data: T | null; error: AdminAuthError | null }>,
  action: "sign-in" | "register" | "manage",
) {
  const { data, error } = await operation();
  if (error || data === null) throw new Error(passkeyErrorMessage(error, action));
  return data;
}
