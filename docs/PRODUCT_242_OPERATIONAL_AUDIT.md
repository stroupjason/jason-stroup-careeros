# PRODUCT-242 operational-readiness audit

Audit date: August 8, 2026

## Authority model

- Supabase durable records are canonical for mutable operational state.
- The allowlisted public projection is canonical for live public Learning views.
- `src/data/learning.ts` is the offline/recovery fallback and idempotent new-record seed.
- Seed changes use stable keys and must not overwrite existing durable rows.
- GitHub is canonical for application source, schema, migrations, tests, and release history.

## PRODUCT-221 through PRODUCT-227

| Ticket | Acceptance criterion | Already implemented | Automated verification | Production verification | Genuinely missing | Recommended status |
|---|---|---|---|---|---|---|
| PRODUCT-221 | Pointer, touch, keyboard and conventional movement; announcements; fractional rank; safe undo | Drag handle, DnD provider, keyboard instructions, status selector, pending confirmation, optimistic rollback, RPC rank, live region, and undo exist | RPC/revision contract checks exist; no complete interaction test covers every input mode | Authorized admin board has loaded in production; no reviewed durable move/reload/undo exercise is recorded | Reversible production move, reload persistence, filtered-rank safety, and touch/keyboard exercise | In Review |
| PRODUCT-222 | Unknown dates; blocker gate; mandatory Done gate; audited target history | Editor, transition context, blockers, acceptance items, revision checks, and database gates exist | Migration/contract tests cover stale revisions and completion requirements | No reviewed SQL-002 edit and transition-gate matrix is recorded | Authorized edit with unknowns preserved, blocked and Done gates, audit check, reload | In Review |
| PRODUCT-223 | One running session; valid chronology; derived effort; approved public summary | Start, stop, manual correction, capture, and audited RPC paths exist | Backend contract and static chronology validation exist | No real SQL session has intentionally been recorded | One truthful work session, correction/reload, audit, and projection exercise | In Review |
| PRODUCT-224 | Validated source; exact scope; newest verified selection; provider API deferred | Candidate/verified snapshots, source metadata, private reference, approval, and projection rules exist | Course progress and backend-contract tests cover candidate/verified selection and private boundaries | Verified historical SQL progress is live; the full admin mutation/reload path is not recorded | Authorized snapshot mutation, reload, and public projection refresh | In Review |
| PRODUCT-225 | Deterministic local model; points are not hours; missing inputs; user estimate preserved | Task Coach factors, split recommendation, planning range separation, and editor controls exist | Seventeen focused boundary and guidance tests pass | No specific production review of SQL-002 missing-input guidance is recorded | Production UI review and confirmation that user estimate remains unchanged | In Review |
| PRODUCT-226 | Three official course records; no invented progress; no credit/admission claim | Program, specialization, course, ticket, and truth-boundary records exist | Backend and Learning tests cover course numbers, snapshots, empty progress, and claims | CU coursework release is deployed and public records have been reviewed | Durable/public snapshot parity should be rechecked during PRODUCT-244 | Done |
| PRODUCT-227 | Anonymous/non-admin denial; no secrets; refresh; persistence | Security policies, membership RPC, direct routes, rollback scripts, and many focused checks exist | Secret, migration, data, route, and authorization contract checks exist | Cross-browser email recovery, Windows Hello registration, local sign-out, passkey re-entry, authorization, protected-route access, and durable reload passed on the canonical origin | Reversible movement, stale-write rejection, projection refresh, and the remaining mobile/keyboard recovery matrix | In Progress |

No ticket is moved to Done merely because controls or RPCs exist.

## PRODUCT-240 reconciliation

PRODUCT-240's source PR is merged at `8825267`, GitHub CI passed, the Vercel
production deployment is Ready, and the live recruiter-facing routes were
verified. Its checked-in fallback remains `In Review` because the durable row
must move through the authorized mutation path with completion evidence and an
audit event. PRODUCT-244 should use PRODUCT-240 as the first truthful,
reversible reconciliation case; a seed change must not overwrite it.

## PRODUCT-243 production gate

Automated checks verify client opt-in, unsupported/cancelled behavior, safe
return paths, and membership enforcement. Jason completed the real production
gate on August 8, 2026 at `https://www.jasonstroup.website`: cross-browser email
recovery succeeded, Windows Hello registered a passkey, local sign-out and
passkey re-entry succeeded, the protected admin route opened, and durable data
persisted after reload. The durable PRODUCT-243 row still requires the audited
completion transition used by PRODUCT-244 reconciliation.

Google Password Manager registration did not create a usable credential in a
separate attempt. PRODUCT-250 tracks that provider-specific observation as a
Backlog Bug; no root cause or compatibility fix is claimed.
