# Sprint 001 deployment checklist

The production domain, public email, and reviewed resume are intentionally not
invented in this repository. Complete these steps only after Jason approves the
final values and assets.

## Canonical URL

Set `VITE_SITE_URL` in the Vercel project to the approved origin without a
trailing slash, for example `https://portfolio.example`. The application emits
route-specific canonical and Open Graph URLs only when this value exists, so a
preview deployment does not accidentally become canonical.

## Sitemap

After the domain is approved, generate `public/sitemap.xml` with an absolute
`<loc>` for every route in `docs/SITE_MAP.md`. Add the resulting absolute URL to
`public/robots.txt`:

```text
Sitemap: https://approved.example/sitemap.xml
```

Do not publish a sitemap containing a placeholder or preview hostname.

## Sharing image

`public/og-careeros.png` is a CareerOS branding card, not project evidence. Test
the final production URL in the sharing debuggers used by the intended social
platforms after deployment.

## Preview verification

On a Vercel preview deployment:

1. Open every route in `docs/SITE_MAP.md` directly in a fresh tab.
2. Refresh at least one project route and one role route.
3. Verify the custom 404 on an unknown route.
4. Complete the recruiter journey: Home → project → role lens → Contact.
5. Verify keyboard navigation, visible focus, mobile layout, and reduced motion.

## Launch approvals still required

- production domain
- recruiter-safe public email
- reviewed resume at `public/resume/Jason-Stroup-Resume.pdf`
- at least one personally owned artifact for each featured personal project
