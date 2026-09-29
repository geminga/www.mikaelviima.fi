# CLAUDE.md — mikaelviima.fi

## Read this first

**The full creative/design/content brief lives at [`mikael_viima_author_website_brief.md`](./mikael_viima_author_website_brief.md) in the repo root. Read it before making any design, copy, or structural decision on this project.** It is long (35 sections) but authoritative on **positioning, voice, brand hierarchy, content and copy** — it covers brand positioning, voice, sitemap, full page-by-page copy, SEO/structured data, and an explicit list of copy clichés to avoid. When in doubt on *what the site says and how it's positioned*, the brief wins over your own instincts about "typical author sites."

**Important caveat, confirmed by the user directly:** the brief was written by ChatGPT, not a designer or developer. Its content/voice/positioning sections (§1–4, §9–24, §29–34) are authoritative. Its *visual* prescriptions (§5–8 mood/palette/typography/imagery, §26–28 motion/layout) are a reasonable starting point, not gospel — the user has explicitly said style alterations are welcome where they'd make the site look better. Treat the color tokens and font choices (Newsreader/Inter/IBM Plex Mono) as the current implementation, not an untouchable spec — see "Design additions beyond the brief" below for what's already been changed and why.

This file (CLAUDE.md) only records *how the site is built* (stack, structure, conventions) and decisions made while implementing the brief. It does not restate the brief's content — go read the source.

## What this project is

The English-language author website for **Mikael Viima** (literary name of Finnish writer Manne Mikael Laukkanen), deployed to GitHub Pages. Fiction + poetry under "Mikael Viima"; nonfiction under his legal name "Manne Laukkanen" as a secondary credential. See brief §1 for the exact brand-hierarchy rules — do not treat the two names as equal/competing brands.

## Stack

- **Eleventy (11ty)**, static site generator. Chosen because the brief (§25) requires: static output, no framework unless it "genuinely simplifies maintenance," content in Markdown/JSON/YAML, minimal JS. 11ty gives shared layouts + a single content-data model without shipping a JS framework to the browser.
- **Nunjucks** templates (`.njk`).
- **No CSS framework.** Hand-written CSS implementing the brief's palette/type system directly (`src/assets/css/style.css`). No Tailwind/Bootstrap — the brief's restraint principle (§5) fights utility-class soup.
- **Self-hosted fonts** (Newsreader, Inter, IBM Plex Mono via `@fontsource/*`, woff2 only, latin subset copied into `src/assets/fonts/`) — brief §25 says no ad trackers/invasive third parties; Google Fonts' CDN leaks visitor IPs to Google on every pageview, so self-hosting is the correct read of the privacy requirement, not just a performance choice.
- **Zero client-side JS** at launch beyond what's strictly needed (currently: none). Add JS only if a feature can't work without it, and keep it small/vanilla.
- Deploy target: **GitHub Pages** via GitHub Actions (`.github/workflows/deploy.yml`), building `src/` → `_site/` and publishing.

## Content model (brief §29)

All recurring facts live in `src/_data/*.yaml`, never hard-coded in templates:

- `author.yaml` — name, legal name, short descriptor, contact/press/rights emails, social links.
- `books.yaml` — one entry per book, matches the schema in brief §22.
- `current_work.yaml` — FEED (poetry manuscript) title/status/poem count.
- `site.yaml` — site-wide constants (base URL, nav structure).

Templates read from these — e.g. `{{ author.contact_email }}` — so a placeholder or real value only needs to change in one place.

## Placeholders (brief §30)

The brief explicitly says: leave obvious placeholders rather than guessing. These are stored as literal bracketed strings in the YAML data files (e.g. `"[CONTACT_EMAIL — confirm before launch]"`) and rendered as-is:

- Contact / press / rights email addresses
- Instagram / social URLs
- Final production domain
- Author portrait(s) and photographer credits — rendered as a labeled placeholder block (`.portrait-placeholder`), never a stock/AI photo, per brief §8 and §31
- Book cover images — labeled placeholder blocks until real cover art is supplied
- Poetry excerpts (`{{POEM_1_TITLE}}` etc. per brief §12) — not filled in until the final manuscript selection is locked
- Third Aarni Susi novel status, translation-rights status, any agent/representation info

**Do not invent values for these.** If the user supplies a real email, URL, image, or poem text in a future session, replace the placeholder in the relevant `_data/*.yaml` file (or `src/assets/images/`) — do not scatter the new value across templates.

**Expected image filenames** (none exist yet — user plans to drop these into `src/assets/images/` in a future session): `portrait.jpg` (author photo) and `covers/verijalki.jpg`, `covers/rekyyli.jpg`, `covers/vaaralliset-gurut.jpg` (book covers). When they arrive: swap the `.portrait-placeholder` / `.cover` placeholder markup in `index.njk`, `about/index.njk`, `books/index.njk`, and `_includes/partials/book-detail-macro.njk` for real `<img>` tags, get intrinsic width/height (e.g. via the `image-size` package) to set explicit dimensions and avoid layout shift per brief §25, and drop the grid+corner-mark "archival plate" treatment for that specific slot (it's meant to signal "pending," not to frame a real photo).

## Voice discipline

Brief §32 and §31 ("Copy clichés") are a hard filter for any new copy: no "master storyteller," "award-winning" (unless named), "unique voice," "gripping page-turner," "journey," "weaving together," "at the intersection of," "delves into," "Nordic darkness," "from the frozen north," etc. Concrete beats abstract; implication beats adjectives. Re-read brief §32's three tests (concrete / earned / respects the reader) before shipping new prose.

## Repo structure

```
src/
  _data/            # author.yaml, books.yaml, current_work.yaml, site.yaml
  _includes/
    layouts/base.njk
    partials/       # header, footer, seo/meta
  assets/
    css/style.css
    fonts/           # self-hosted woff2
    images/          # real assets + placeholder graphics once supplied
  index.njk          # Home
  poetry/index.njk   # FEED
  books/index.njk
  books/verijalki.njk
  books/rekyyli.njk
  books/vaaralliset-gurut.njk
  about/index.njk
  contact/index.njk
  press/index.njk
  404.njk
  robots.txt.njk
  sitemap.xml.njk
.eleventy.js
```

## Conventions

- Poetry text must preserve exact whitespace/lineation (brief §7, §12) — always render poem bodies inside a `<pre>`-based component with the monospace font, never through a Markdown pipeline that normalizes whitespace.
- Motion: only what brief §26 allows (subtle underline/color transitions, ≤200ms). Respect `prefers-reduced-motion`.
- Every new page needs: SEO title, meta description, canonical URL, OG tags — via the shared `seo.njk` partial, not copy-pasted `<head>` blocks.
- Finnish books get `inLanguage: Finnish` in structured data — never mark them `en` just because the surrounding site copy is English (brief §24).
- Before editing book/author facts, check brief §22 (canonical metadata) — it's the source of truth, already fact-checked against publisher records as of the brief's writing.

## Design additions beyond the brief

The brief's literal typography spec (§7), rendered as-written, looked flat — quiet-to-the-point-of-generic rather than "editorial." Since the brief isn't a design authority (see caveat above), these were added on top of it (2026-09-29):

- **Much higher type-scale contrast**: hero name now `clamp(3.5rem, 11vw, 8.5rem)` at weight 700 with tight (`-0.03em`) tracking, instead of the brief's implied modest size. Section headings and pull-quotes similarly pushed larger/tighter/heavier (`content-section__heading`, `.pull-quote` in `style.css`). Pull-quotes now render in italic Newsreader for more character. If it starts looking flat again, push scale/weight/tracking further before reaching for a different typeface — the brief's font choices themselves are fine, they just weren't being used with enough contrast.
- **Wind-line motif** (`src/_includes/partials/wind-mark.njk`): a recurring inline-SVG decorative element — thin diagonal sweeping lines — used as the site's signature graphic on every dark hero/section (`.motif-host` class + the partial include). Rationale: "Viima" literally means a cutting wind (brief §1), so this ties directly to the brand name instead of being generic decoration. Reuse this on new dark sections rather than inventing a different motif.
- **Grain texture** (`body::after` in `style.css`): a fixed, static, very-low-opacity SVG noise overlay for "carbon paper" tactility per brief §5's mood language. It's static (not animated), so it doesn't conflict with brief §26's motion restrictions.
- **Archival-plate placeholder treatment**: `.cover` and `.portrait-placeholder` now render a fine grid background + small rust-colored corner registration marks instead of a flat gray/gradient box, so "pending art" reads as an intentional design element (like a technical/archival plate) rather than a broken image. Keep this treatment when new placeholder slots are added; drop it per-instance once real imagery replaces the slot.

None of this changes brief-mandated content, copy, brand hierarchy, or the palette's actual hex values — only how confidently the existing tokens are used.

## Commands

- `npm run dev` — Eleventy dev server with live reload.
- `npm run build` — production build to `_site/`.

## Status

Launch scope = brief §33's minimum viable site: Home, Poetry (FEED), Books (+ 3 book pages), About, Contact. Press page included as a bonus per current structure. Check this section and update it as real content (photos, emails, poems) arrives and placeholders get filled in.
