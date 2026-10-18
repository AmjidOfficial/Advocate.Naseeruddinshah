# Chambers of Naseer Uddin Shah — Advocate Supreme Court of Pakistan

Step 1 of the chambers platform: the Advocate's profile, portfolio and consultation desk —
built as a zero-dependency, dual-theme, SEO-complete website that is architecturally ready
for the multi-lawyer firm (Steps 2–5).

---

## Run it

No build step. Any static server works:

```bash
# from this folder — pick one:
npx -y http-server -p 8080 -c-1
python -m http.server 8080
```

Then open <http://localhost:8080>. PWA installation and service-worker features require
HTTPS or localhost; opening `index.html` directly only runs the page without those features.

## Deploy

The folder is static — drop it on GitHub Pages, Netlify, Cloudflare Pages, Vercel or any
hosting. For GitHub Pages (like your other projects):

```bash
git init && git add -A && git commit -m "chambers step 1"
gh repo create AmjidOfficial/chambers-naseer --public --source=. --push
# then enable Pages on the main branch root
```

---

## Owner checklist — before launch

Everything below lives in **`JS/data.js`** (top of the file) or is a one-file drop:

| What | Where | Note |
|---|---|---|
| WhatsApp number | `JS/data.js` → `SITE.contact.whatsapp` | Configured as `+923339552292`; verify before launch |
| Phone number | `JS/data.js` → `SITE.contact.phone` | Configured as `+923339552292`; verify before launch |
| Email | `JS/data.js` → `SITE.contact.email` | Configured as `naseeruddin143@yahoo.com`; verify before launch |
| Office address | `JS/data.js` → `SITE.contact.office` | Configured as C-3 Rehman Plaza, Khyber Bazar, Peshawar |
| Hours | `JS/data.js` → `SITE.contact.hours` | Configured as Mon–Sat, consultation by appointment |
| Portrait photo | `assets/img/portrait.jpg` | Current portrait is wired in; replace it with an approved 4:5 image if needed |
| Domain | `index.html` (canonical + OG/schema URLs), `sitemap.xml`, `robots.txt` | Production domain: `advocatenaseer.vercel.app`; update all URLs if a custom domain is connected |
| OG share image | `assets/img/og-cover.jpg` | Generated during QA; regenerate or replace any 1200×630 image |
| Availability status | `JS/data.js` → `SITE.status` | Text appears in the nav & drawer badge |

Facebook/LinkedIn block automated photo downloads, which is why the portrait is a
drop-in slot rather than a fetched image.

## Content lives in `JS/data.js`

Practice areas, timeline, news, FAQs and booking options are **data, not markup**.
Edit `data.js` and the site re-renders — no HTML changes needed. All strings there
are escaped automatically when rendered.

## Dual themes

Dark ("Obsidian & Old Gold") is the brand default; the toggle remembers the visitor's
choice and respects system preference on first visit. Both themes were QA'd separately —
including the light-theme side drawer, which uses a solid ivory panel with a gold spine
rather than translucency.

## Features map

- Custom engraved court-seal logo (milled coin edge, circular motto, star, NS monogram,
  laurel) — **no scales/tarazoo, no gavel anywhere**, per direction
- 3D seal hero: pointer/gyro-style tilt, orbital rings, gold-dust canvas, light-follow sheen
- Kinetic headline with per-letter gold gradient
- Animated stat counters with hover sub-metrics (all figures from the real CV)
- Practice-area deck: 3D tilt + flip cards with real statutes, each linking to the booking
  desk with the matter pre-selected
- Filterable record-of-service timeline (real appointments only)
- 3-step consultation booking drawer → WhatsApp handoff (works today, no backend needed)
- Direct WhatsApp / Call floating buttons + contact channels
- Focus-trapped drawers, keyboard support, `prefers-reduced-motion` respected
- SEO/AEO: Attorney/LegalService/Person/FAQPage JSON-LD, OpenGraph, Twitter cards,
  robots.txt, sitemap.xml, semantic HTML
- Installable PWA with Android/iOS app icons, an app manifest, and an offline-cached site shell
- Responsive 320 px → 4K, safe-area aware, print stylesheet

## Roadmap (where this is heading)

| Step | Feature | How this codebase absorbs it |
|---|---|---|
| **2** | Multi-lawyer firm directory | `SITE.roster` already exists — append associates, add a directory page that iterates it |
| **3** | Client portal & case tracker | New app; the chambers site links into it (`#/portal`) |
| **4** | AI legal assistant & case-law search | Later Next.js/NestJS service; site already exposes structured data |
| **5** | Documents, e-sign, invoicing | Backend additions; booking drawer's payment step slots in at step 3 of the flow |

When Step 2+ move to Next.js for app features, this static site remains the SEO face of
the chambers — its content is already data-driven, so the same `SITE` schema ports directly.

## Files

```
index.html        — full page, schema.org JSON-LD, master seal SVG
CSS/style.css     — dual-theme design system (tokens → components → media queries)
CSS/responsive-hardening.css — device-specific responsive overrides
JS/data.js        — content + contact config (edit here)
JS/app.js         — engine: theme, 3D, renderers, drawers, booking, WhatsApp handoff
JS/pwa.js         — secure-context service-worker registration
sw.js · manifest.json · vercel.json
assets/favicon.svg, assets/icons/, assets/img/
robots.txt · sitemap.xml
```

## Honesty notes (why some sections are structured but light)

- **No fabricated numbers**: stats are the real ones from the CV (2006 call, 3 court tiers,
  4 state offices, 3 degrees). Template metrics like "$150M recovered" or "98.4% success"
  were deliberately not invented — they'd be untrue for a real advocate.
- **No fabricated case citations**: PLD/SC citations are real legal references; inventing
  them would be dishonest and risky. The section explains citations are shared through
  chambers and the archive is in preparation — drop real judgments into `SITE.news`/a new
  `judgments` array when ready.
- **No fabricated testimonials**: client-attorney confidentiality is the stated reason on
  the page. Add real, consented quotes later.
