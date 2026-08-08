import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Bug as BugIcon,
  ClipboardList,
  Fingerprint,
  KeyRound,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useLearningAdmin } from "../admin/AdminContext";
import { adminReturnToStorageKey, resolveAdminReturnTo } from "../admin/adminAuth";
import { AdminSecurityPanel } from "../components/AdminSecurityPanel";
import { LinkButton, PageHero, SectionHeader } from "../components/UI";

function magicLinkButtonLabel(seconds: number) {
  if (seconds >= 60) return `Retry in ${Math.ceil(seconds / 60)}m`;
  return `Retry in ${seconds}s`;
}

export function AdminLoginPage() {
  const admin = useLearningAdmin();
  const [email, setEmail] = useState("");
  const [cooldownClock, setCooldownClock] = useState(() => Date.now());
  const returnTo = useMemo(
    () => resolveAdminReturnTo(window.location.search, window.sessionStorage),
    [],
  );

  useEffect(() => {
    if (admin.authState !== "admin") return;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (returnTo === current || (returnTo === "/admin" && window.location.pathname === "/admin")) return;
    window.sessionStorage.removeItem(adminReturnToStorageKey);
    window.location.replace(returnTo);
  }, [admin.authState, returnTo]);

  useEffect(() => {
    if (!admin.magicLinkCooldownUntil) return;
    setCooldownClock(Date.now());
    const timer = window.setInterval(() => setCooldownClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [admin.magicLinkCooldownUntil]);

  const magicLinkCooldownSeconds = admin.magicLinkCooldownUntil
    ? Math.max(0, Math.ceil((admin.magicLinkCooldownUntil - cooldownClock) / 1000))
    : 0;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await admin.requestMagicLink(email);
  }

  return (
    <>
      <PageHero
        eyebrow="CareerOS administration"
        title={admin.authState === "admin" ? "CareerOS admin workspace" : "Secure CareerOS access"}
        copy={admin.authState === "admin"
          ? "Choose the private workspace you need, preview the public projection, or sign out when the session is complete."
          : "Passkey-first access is restricted to the pre-provisioned CareerOS administrator, with email secure links retained for recovery."}
        actions={admin.authState === "admin" ? (
          <>
            <LinkButton href="/learning/board">
              <ClipboardList size={17} aria-hidden="true" /> Open learning board
            </LinkButton>
            <LinkButton href="/admin/operations/bugs" secondary>
              <BugIcon size={17} aria-hidden="true" /> Open private Bug Log
            </LinkButton>
          </>
        ) : undefined}
      />
      <section className="section shell sectionAfterHero adminLoginSection">
        {admin.authState === "loading" ? (
          <div className="adminLoginPanel">
            <KeyRound size={24} aria-hidden="true" />
            <div>
              <SectionHeader kicker="Session check" title="Checking secure access." />
              <p>CareerOS is confirming the current Supabase session and administrator membership.</p>
            </div>
          </div>
        ) : admin.authState === "admin" ? (
          <div className="adminAuthorizedStack">
            <div className="adminLoginPanel">
              <ShieldCheck size={24} aria-hidden="true" />
              <div>
                <SectionHeader kicker="Authorized" title="Admin mode is active." />
                <p>
                  Use the learning board to create, edit, move, and review tickets. Use the private Bug Log
                  for classification, incident context, diagnostic observations, and sanitized RCA review.
                </p>
                <button className="button secondary" type="button" onClick={() => void admin.signOut()}>
                  <LogOut size={17} aria-hidden="true" /> Sign out
                </button>
              </div>
            </div>
            <AdminSecurityPanel />
          </div>
        ) : admin.authState === "unauthorized" ? (
          <div className="adminLoginPanel">
            <KeyRound size={24} aria-hidden="true" />
            <div>
              <SectionHeader kicker="Access denied" title="This session is not an administrator." />
              <p>
                Sign out, then request a new secure link using the pre-provisioned CareerOS administrator
                email address.
              </p>
              <button className="button secondary" type="button" onClick={() => void admin.signOut()}>
                <LogOut size={17} aria-hidden="true" /> Sign out and retry
              </button>
            </div>
          </div>
        ) : (
          <div className="adminLoginPanel adminLoginForm">
            <Fingerprint size={24} aria-hidden="true" />
            <div>
              <SectionHeader kicker="Passkey sign in" title="Use your registered passkey." />
              <p>
                A registered passkey can restore the Supabase session without entering an email address.
                CareerOS still verifies the immutable administrator membership before opening the requested workspace.
              </p>
              <button
                className="button primary"
                type="button"
                disabled={!admin.configured || !admin.passkeySupported || !admin.passkeyOriginReady || admin.busyAction === "passkey-sign-in"}
                onClick={() => void admin.signInWithPasskey()}
              >
                <Fingerprint size={17} aria-hidden="true" />
                {admin.busyAction === "passkey-sign-in" ? "Checking passkey..." : "Sign in with passkey"}
              </button>
              {!admin.passkeySupported ? <p role="status">This browser does not support passkeys. Use email recovery.</p> : null}
              {admin.passkeySupported && !admin.passkeyOriginReady ? <p role="status">Passkey sign-in is available only at https://www.jasonstroup.website.</p> : null}

              <details className="adminRecovery">
                <summary>Email secure-link recovery</summary>
                <form onSubmit={(event) => void submit(event)}>
                  <p>
                    Enter the pre-provisioned administrator email. The secure link establishes a session,
                    then CareerOS verifies administrator membership before returning to the requested route.
                  </p>
                  <label>
                    Email address
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.currentTarget.value)}
                    />
                  </label>
                  <button className="button secondary" type="submit" disabled={!admin.configured || admin.busyAction === "sign-in" || magicLinkCooldownSeconds > 0}>
                    <KeyRound size={17} aria-hidden="true" />
                    {admin.busyAction === "sign-in"
                      ? "Requesting..."
                      : magicLinkCooldownSeconds > 0
                        ? magicLinkButtonLabel(magicLinkCooldownSeconds)
                        : "Email secure link"}
                  </button>
                </form>
              </details>
              <p>This owner entry point is intentionally omitted from public navigation. Bookmark <strong>/admin</strong>.</p>
              {!admin.configured ? <p role="status">Authentication is not configured in this deployment.</p> : null}
            </div>
          </div>
        )}
        {admin.notice ? <p className="adminNotice" role="status">{admin.notice}</p> : null}
      </section>
    </>
  );
}
