import { useState, type FormEvent } from "react";
import {
  Bug as BugIcon,
  ClipboardList,
  KeyRound,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useLearningAdmin } from "../admin/AdminContext";
import { LinkButton, PageHero, SectionHeader } from "../components/UI";

export function AdminLoginPage() {
  const admin = useLearningAdmin();
  const [email, setEmail] = useState("");

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
          : "Passwordless access is restricted to the pre-provisioned CareerOS administrator."}
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
          <form className="adminLoginPanel adminLoginForm" onSubmit={(event) => void submit(event)}>
            <KeyRound size={24} aria-hidden="true" />
            <div>
              <SectionHeader kicker="Passwordless sign in" title="Request a secure link." />
              <p>
                Enter the pre-provisioned administrator email. The email link returns to this site,
                establishes the Supabase session, and then verifies the private admin membership.
              </p>
              <label>
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                />
              </label>
              <button
                className="button primary"
                type="submit"
                disabled={!admin.configured || admin.busyAction === "sign-in"}
              >
                <KeyRound size={17} aria-hidden="true" />
                {admin.busyAction === "sign-in" ? "Requesting..." : "Email secure link"}
              </button>
              <p>
                This owner entry point is intentionally omitted from the public navigation. Bookmark
                <strong> /admin</strong> for future access.
              </p>
              {!admin.configured ? <p role="status">Authentication is not configured in this deployment.</p> : null}
            </div>
          </form>
        )}
        {admin.notice ? <p className="adminNotice" role="status">{admin.notice}</p> : null}
      </section>
    </>
  );
}
