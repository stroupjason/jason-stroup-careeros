import { useState, type FormEvent } from "react";
import { KeyRound, LogOut, ShieldCheck } from "lucide-react";
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
        title="Secure learning workspace"
        copy="Passwordless access is restricted to the pre-provisioned CareerOS administrator."
        actions={admin.authState === "admin" ? <LinkButton href="/learning/board">Open learning board</LinkButton> : undefined}
      />
      <section className="section shell sectionAfterHero adminLoginSection">
        {admin.authState === "admin" ? (
          <div className="adminLoginPanel">
            <ShieldCheck size={24} aria-hidden="true" />
            <div>
              <SectionHeader kicker="Authorized" title="Admin mode is active." />
              <p>The existing learning board and ticket routes now include private management controls.</p>
              <button className="button secondary" type="button" onClick={() => void admin.signOut()}>
                <LogOut size={17} aria-hidden="true" /> Sign out
              </button>
            </div>
          </div>
        ) : (
          <form className="adminLoginPanel adminLoginForm" onSubmit={(event) => void submit(event)}>
            <KeyRound size={24} aria-hidden="true" />
            <div>
              <SectionHeader kicker="Passwordless sign in" title="Request a secure link." />
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
              <button className="button primary" type="submit" disabled={admin.busyAction === "sign-in"}>
                <KeyRound size={17} aria-hidden="true" />
                {admin.busyAction === "sign-in" ? "Requesting..." : "Email secure link"}
              </button>
              {admin.authState === "unauthorized" ? <p role="status">This signed-in session does not have access to the admin workspace.</p> : null}
              {!admin.configured ? <p role="status">Authentication is not configured in this deployment.</p> : null}
            </div>
          </form>
        )}
        {admin.notice ? <p className="adminNotice" role="status">{admin.notice}</p> : null}
      </section>
    </>
  );
}
