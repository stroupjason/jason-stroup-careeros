import { useEffect, useState, type FormEvent } from "react";
import { Fingerprint, Pencil, RefreshCw, ShieldCheck, Trash2, X } from "lucide-react";
import { useLearningAdmin } from "../admin/AdminContext";
import type { PasskeyRecord } from "../admin/adminAuth";
import { SectionHeader } from "./UI";

function formatPasskeyDate(value?: string) {
  if (!value) return "Not yet used";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unavailable"
    : new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function PasskeyItem({ passkey, onlyPasskey }: { passkey: PasskeyRecord; onlyPasskey: boolean }) {
  const admin = useLearningAdmin();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(passkey.friendly_name ?? "CareerOS passkey");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => setName(passkey.friendly_name ?? "CareerOS passkey"), [passkey.friendly_name]);

  async function rename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await admin.renamePasskey(passkey.id, name);
    setEditing(false);
  }

  return (
    <li className="passkeyItem">
      <div>
        <strong>{passkey.friendly_name || "CareerOS passkey"}</strong>
        <span>Created {formatPasskeyDate(passkey.created_at)}</span>
        <span>Last used {formatPasskeyDate(passkey.last_used_at)}</span>
      </div>
      {editing ? (
        <form className="passkeyRename" onSubmit={(event) => void rename(event)}>
          <label>
            Passkey name
            <input maxLength={120} required value={name} onChange={(event) => setName(event.currentTarget.value)} />
          </label>
          <button className="iconButton" type="submit" title="Save passkey name" aria-label="Save passkey name">
            <ShieldCheck size={17} aria-hidden="true" />
          </button>
          <button className="iconButton" type="button" title="Cancel rename" aria-label="Cancel passkey rename" onClick={() => setEditing(false)}>
            <X size={17} aria-hidden="true" />
          </button>
        </form>
      ) : (
        <div className="passkeyActions">
          <button className="iconButton" type="button" title="Rename passkey" aria-label={`Rename ${passkey.friendly_name || "passkey"}`} onClick={() => setEditing(true)}>
            <Pencil size={17} aria-hidden="true" />
          </button>
          {confirmDelete ? (
            <>
              <button className="button secondary" type="button" onClick={() => void admin.deletePasskey(passkey.id)}>
                Confirm removal
              </button>
              <button className="iconButton" type="button" title="Cancel removal" aria-label="Cancel passkey removal" onClick={() => setConfirmDelete(false)}>
                <X size={17} aria-hidden="true" />
              </button>
            </>
          ) : (
            <button
              className="iconButton"
              type="button"
              title={onlyPasskey ? "Register a replacement before removing this passkey" : "Remove passkey"}
              aria-label={`Remove ${passkey.friendly_name || "passkey"}`}
              disabled={onlyPasskey}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={17} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </li>
  );
}

export function AdminSecurityPanel() {
  const admin = useLearningAdmin();
  const hasPasskeys = admin.passkeys.length > 0;

  return (
    <section className="adminSecurityPanel" aria-labelledby="admin-security-title">
      <div className="adminSecurityHeading">
        <Fingerprint size={24} aria-hidden="true" />
        <SectionHeader kicker="Admin security" title="Passkeys and recovery" />
      </div>
      <p>
        Passkeys provide phishing-resistant re-entry on the canonical CareerOS origin. Email secure links remain available as recovery while this Supabase capability is experimental.
      </p>
      {!admin.passkeySupported ? (
        <p role="status">This browser does not support passkeys. Continue using email recovery.</p>
      ) : !admin.passkeyOriginReady ? (
        <p role="status">Passkey enrollment and sign-in are limited to https://www.jasonstroup.website.</p>
      ) : null}

      <div className="adminSecurityActions">
        <button
          className="button primary"
          type="button"
          disabled={!admin.passkeySupported || !admin.passkeyOriginReady || Boolean(admin.busyAction)}
          onClick={() => void admin.registerPasskey()}
        >
          <Fingerprint size={17} aria-hidden="true" /> {hasPasskeys ? "Register another passkey" : "Register first passkey"}
        </button>
        <button className="button secondary" type="button" disabled={Boolean(admin.busyAction)} onClick={() => void admin.listPasskeys()}>
          <RefreshCw size={17} aria-hidden="true" /> Refresh credentials
        </button>
      </div>

      {hasPasskeys ? (
        <ul className="passkeyList">
          {admin.passkeys.map((passkey) => (
            <PasskeyItem key={passkey.id} passkey={passkey} onlyPasskey={admin.passkeys.length === 1} />
          ))}
        </ul>
      ) : (
        <p className="adminEmptyState">No passkey is registered yet. CareerOS will not claim passkey access until registration succeeds.</p>
      )}
    </section>
  );
}
