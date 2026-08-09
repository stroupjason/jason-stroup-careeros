import { describe, expect, it, vi } from "vitest";
import {
  adminReturnToStorageKey,
  buildAdminRecoveryRedirect,
  isPasskeySupported,
  isCanonicalPasskeyOrigin,
  magicLinkNotice,
  magicLinkRetrySeconds,
  passkeyErrorMessage,
  requirePasskeyResult,
  resolveAdminReturnTo,
  validateAdminReturnTo,
} from "./adminAuth";

function memoryStorage(initial?: string) {
  const values = new Map<string, string>();
  if (initial) values.set(adminReturnToStorageKey, initial);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("CareerOS admin authentication helpers", () => {
  it("allows only approved same-origin return paths", () => {
    expect(validateAdminReturnTo("/admin/operations/bugs")).toBe("/admin/operations/bugs");
    expect(validateAdminReturnTo("/learning/board?type=Bug")).toBe("/learning/board?type=Bug");
    expect(validateAdminReturnTo("/learning/tickets/SQL-002#evidence")).toBe("/learning/tickets/SQL-002#evidence");
    expect(validateAdminReturnTo("//example.com")).toBe("/admin");
    expect(validateAdminReturnTo("https://example.com/admin")).toBe("/admin");
    expect(validateAdminReturnTo("/projects/careeros")).toBe("/admin");
    expect(validateAdminReturnTo("/administer")).toBe("/admin");
    expect(validateAdminReturnTo("/admin\\evil")).toBe("/admin");
  });

  it("preserves a validated destination across a recovery redirect", () => {
    const storage = memoryStorage();
    expect(resolveAdminReturnTo("?returnTo=%2Flearning%2Fboard", storage)).toBe("/learning/board");
    expect(resolveAdminReturnTo("", storage)).toBe("/learning/board");
  });

  it("carries a validated destination into a cross-browser recovery link", () => {
    const storage = memoryStorage("/admin/operations/bugs");
    expect(buildAdminRecoveryRedirect("https://www.jasonstroup.website", "", storage)).toBe(
      "https://www.jasonstroup.website/admin/login?returnTo=%2Fadmin%2Foperations%2Fbugs",
    );
    expect(buildAdminRecoveryRedirect(
      "https://www.jasonstroup.website",
      "?returnTo=https%3A%2F%2Fevil.example",
      storage,
    )).toBe("https://www.jasonstroup.website/admin/login");
  });

  it("replaces a malicious stored destination with the safe default", () => {
    const storage = memoryStorage("//example.com");
    expect(resolveAdminReturnTo("", storage)).toBe("/admin");
    expect(storage.getItem(adminReturnToStorageKey)).toBe("/admin");
  });

  it("detects passkey support without claiming enrollment", () => {
    expect(isPasskeySupported({ PublicKeyCredential: {}, credentials: {} })).toBe(true);
    expect(isPasskeySupported({ PublicKeyCredential: {}, credentials: undefined })).toBe(false);
    expect(isCanonicalPasskeyOrigin("https://www.jasonstroup.website")).toBe(true);
    expect(isCanonicalPasskeyOrigin("https://preview.vercel.app")).toBe(false);
  });

  it("handles mocked registration success and failure", async () => {
    const success = vi.fn().mockResolvedValue({ data: { id: "passkey-1" }, error: null });
    await expect(requirePasskeyResult(success, "register")).resolves.toEqual({ id: "passkey-1" });

    const failure = vi.fn().mockResolvedValue({ data: null, error: { code: "passkey_disabled" } });
    await expect(requirePasskeyResult(failure, "register")).rejects.toThrow("Passkeys are not enabled");
  });

  it("handles mocked sign-in failure and cancellation", async () => {
    const failure = vi.fn().mockResolvedValue({ data: null, error: { code: "webauthn_credential_not_found" } });
    await expect(requirePasskeyResult(failure, "sign-in")).rejects.toThrow("No registered CareerOS passkey");

    expect(passkeyErrorMessage({ cause: { name: "NotAllowedError" } }, "sign-in")).toContain("cancelled");
    const cancelled = vi.fn().mockResolvedValue({ data: null, error: { cause: { name: "NotAllowedError" } } });
    await expect(requirePasskeyResult(cancelled, "sign-in")).rejects.toThrow("was cancelled");
  });

  it("separates the short email cooldown from the hourly project limit", () => {
    const shortLimit = { code: "over_email_send_rate_limit", status: 429, message: "For security purposes, you can only request this after 30 seconds." };
    expect(magicLinkRetrySeconds(shortLimit)).toBe(30);
    expect(magicLinkNotice(shortLimit, 30)).toContain("30 seconds");

    const hourlyLimit = { code: "over_email_send_rate_limit", status: 429, message: "email rate limit exceeded" };
    expect(magicLinkRetrySeconds(hourlyLimit)).toBe(3600);
    expect(magicLinkNotice(hourlyLimit, 3600)).toContain("up to one hour");
    expect(magicLinkNotice(null, 30)).toContain("If this address is authorized");
  });
});
