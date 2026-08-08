# Sprint 001 deployment checklist

The production domain, public email, and reviewed resume are intentionally not
invented in this repository. Complete these steps only after Jason approves the
final values and assets.

## Canonical URL

The approved production origin is `https://www.jasonstroup.website`. It is the
canonical source in the application so production and preview builds emit the
same route-specific canonical and Open Graph URLs. The apex domain redirects to
the `www` production domain.

## Sitemap

After the beta `noindex` requirement is explicitly removed, generate
`public/sitemap.xml` with an absolute
`<loc>` for every route in `docs/SITE_MAP.md`. Add the resulting absolute URL to
`public/robots.txt`:

```text
Sitemap: https://www.jasonstroup.website/sitemap.xml
```

Do not publish the sitemap while the current `noindex` controls remain, and do
not publish one containing a preview hostname. Keep `docs/SITE_MAP.md`
synchronized now so the analytics project route is included at recruiter
launch.

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
