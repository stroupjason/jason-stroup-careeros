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

export async function requirePasskeyResult<T>(
  operation: () => Promise<{ data: T | null; error: AdminAuthError | null }>,
  action: "sign-in" | "register" | "manage",
) {
  const { data, error } = await operation();
  if (error || data === null) throw new Error(passkeyErrorMessage(error, action));
  return data;
}
