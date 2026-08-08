# CareerOS analytics and attribution

CareerOS uses Vercel Web Analytics as its lightweight production measurement
layer. The implementation is designed to answer portfolio product questions
without collecting form contents, contact details, arbitrary URL parameters,
or visitor-level data in the public repository.

## Current status

- Parent project: `CareerOS Analytics & Integrations`
- Active work: `PORT-005`
- Production domain: `https://www.jasonstroup.website`
- Deployed and production-checked: official React analytics client, typed custom
  events, allowlisted UTM handling, URL redaction, browser Do Not Track
  behavior, local anonymous-usage preference, canonical metadata, and the
  production insights script
- Still being verified: automatic page-view results and custom-event results in
  the correct Vercel dashboard
- Completion gate: production requests and resulting events must both be
  verified in the correct Vercel dashboard
- Not live: GA4, Microsoft Clarity, Search Console, inquiry capture, Google
  Sheets, HubSpot, and the LinkedIn Insight Tag

## Event taxonomy

| Event | Controlled properties | Product question |
|---|---|---|
| `Project Opened` | project slug, fixed page location | Which work earns deeper review? |
| `Role Lens Opened` | role slug, fixed page location | Which professional lens is most useful? |
| `Primary CTA Selected` | fixed destination and location | Which core path moves visitors forward? |
| `External Profile Opened` | fixed profile and location | Which public evidence destination is useful? |

The event names and locations are TypeScript unions. Project and role values use
public slugs. Event properties never include names entered by visitors, email
addresses, message text, free-form search terms, or private account values.

Vercel's React client records page views. It supports history-state navigation;
CareerOS currently uses normal browser navigation between its Vite routes, so
direct route loads and refreshes are the primary page-view verification cases.

## Campaign attribution

Campaign links may use only these parameters:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`

Values are normalized to lowercase letters, numbers, periods, underscores, and
hyphens, then limited to 64 characters. Attribution is retained only for the
current browser session. Custom events carry source, medium, and campaign;
content remains available for a later server-validated inquiry flow. All other
query parameters and URL fragments are removed before analytics events are
sent.

Example LinkedIn campaign URL:

```text
https://www.jasonstroup.website/?utm_source=linkedin&utm_medium=social&utm_campaign=careeros-launch&utm_content=profile
```

## Privacy behavior

Anonymous analytics is enabled by default because the current Vercel layer is
cookie-free. A browser Do Not Track setting disables analytics by default, and
the footer preference lets a visitor make an explicit local choice. The choice
is stored in that browser only and does not create an account or identity.

Future tools with different consent or session behavior, including GA4 and
Microsoft Clarity, must be consent-gated and independently reviewed before they
are enabled.

## Production verification

1. Open the home page with no query string and confirm the Vercel insights
   script loads without an application console error.
2. Open the home page with the allowlisted LinkedIn example and confirm the
   page-view request contains only normalized UTM values.
3. Open a project, role lens, primary call to action, and public profile; confirm
   the expected typed event requests are emitted.
4. Disable `Share anonymous usage`, reload, and confirm page-view and custom
   event requests are suppressed.
5. Re-enable the preference, test a direct project URL and browser refresh, and
   confirm page-view requests resume.
6. Confirm page views and custom event names appear in the correct production
   Vercel dashboard. Do not record private totals or visitor details here.

`PORT-005` and Phase 1 remain Active until step 6 is confirmed. A successful
package install, typecheck, build, or deployment is necessary but not enough.

## Future server-to-server boundary

`PORT-006` will own inquiry capture. Browser code will call a same-origin Vercel
endpoint; server code will validate Turnstile, sign the outbound Apps Script
request, and keep webhook credentials and Sheet identifiers in protected
environment variables. Successful-submission analytics will be emitted only
after server validation and storage succeed.
