# CLAUDE.md — mikaelviima.fi

## Read this first

**The full creative/design/content brief lives at [`mikael_viima_author_website_brief.md`](./mikael_viima_author_website_brief.md) in the repo root. Read it before making any design, copy, or structural decision on this project.** It covers brand positioning, voice, sitemap, full page-by-page copy, SEO/structured data, and an explicit list of copy clichés to avoid. When in doubt on *what the site says and how it's positioned*, the brief wins over your own instincts about "typical author sites" — but see the caveat below and the brief's own amendment note at its top before treating it as gospel.

**Important caveat, confirmed by the user directly:** the brief was written by ChatGPT, not a designer or developer. Its content/voice/positioning sections are authoritative. Its *visual* prescriptions (mood/palette/typography/imagery/motion) are a reasonable starting point, not an untouchable spec — the user has explicitly said style alterations are welcome where they make the site look better. See "Design additions beyond the brief" below for what's already changed and why. The brief itself now carries a short amendment note at the top flagging this and listing what's been resolved since it was written — read that note first, it's the fastest way to see what's stale in the rest of the document.

This file (CLAUDE.md) records *how the site is built* (stack, structure, conventions) and *current real-world state* (what's live, what's still a placeholder). It is the source of truth for continuing work — if it conflicts with the brief on a factual point (an email address, a domain, whether an image exists), CLAUDE.md wins; the brief only wins on positioning/voice/what-to-say.

## What this project is

The English-language author website for **Mikael Viima** (literary name of Finnish writer Manne Mikael Laukkanen), live at **https://www.mikaelviima.com/**, deployed to GitHub Pages from this repo (`geminga/www.mikaelviima.fi` — the repo name doesn't match the live domain; that's intentional, the user decided not to rename it). Fiction + poetry under "Mikael Viima"; nonfiction under his legal name "Manne Laukkanen" as a secondary credential — do not treat the two names as equal/competing brands.

**Standing content rule, given directly by the user (not just brief inference): lead the whole site with poetry, not fiction**, wherever the two are mentioned together. The English-language debut is poetry (FEED), so poetry comes first in meta descriptions, bios, background lists, and any "he writes X and Y" construction — the Finnish WSOY/Otava fiction and nonfiction catalog is credibility/supporting evidence, not the lead. Already applied throughout Home, About, and Press; apply it to any new copy too.

## Stack

- **Eleventy (11ty)**, static site generator. Chosen because the brief requires static output, minimal JS, content in Markdown/JSON/YAML, and "no framework unless it genuinely simplifies maintenance" — 11ty gives shared layouts + a single content-data model without shipping a JS framework to the browser.
- **Nunjucks** templates (`.njk`).
- **No CSS framework.** Hand-written CSS implementing the brief's palette/type system (`src/assets/css/style.css`).
- **Self-hosted fonts** (Newsreader, Inter, IBM Plex Mono, woff2 only, latin subset, `src/assets/fonts/`) — self-hosting avoids leaking visitor IPs to Google on every pageview via the Google Fonts CDN, which is the correct read of the brief's "no invasive third parties" privacy requirement.
- **Zero client-side JS** beyond what's strictly needed — currently just `src/assets/js/nav.js`, a ~10-line mobile-nav toggle. Keep it that way; add JS only if a feature genuinely can't work without it.
- Deploy: **GitHub Pages via GitHub Actions** (`.github/workflows/deploy.yml`), building `src/` → `_site/` on every push to `main` and publishing. Pages is configured with Source = GitHub Actions in the repo settings (already done, don't need to redo it).

## Domain & DNS (live, not placeholder)

- Production URL: **https://www.mikaelviima.com/**. `src/CNAME` (passthrough-copied into every build) and `src/_data/site.yaml`'s `url` field both carry this — if the domain ever changes, update both, plus the hardcoded `url` in `index.njk`'s WebSite structured-data block.
- DNS is hosted at **Zoner** (the user's webhotel provider), not at the registrar. `www` is a CNAME to `geminga.github.io.`; the apex `mikaelviima.com` has 4 A records pointing at GitHub Pages' IPs (`185.199.108/109/110/111.153`) so bare-domain visitors redirect to `www` instead of hitting Zoner's old parking page. Don't touch the `ftp`/`mail`/`pop`/`smtp`/`NS`/`MX`/`TXT` records at Zoner — those are unrelated email/hosting plumbing.
- HTTPS: GitHub auto-provisions a Let's Encrypt cert for the custom domain once DNS verifies; this can take a while after a domain change. If `https://www.mikaelviima.com/` ever shows the wrong cert (`*.github.io` instead of the real one) or "Enforce HTTPS" is greyed out in Pages settings, that's normal provisioning lag, not a bug — don't "fix" it by changing config.

## Content model

All recurring facts live in `src/_data/*.yaml`, never hard-coded in templates:

- `author.yaml` — name, legal name, short descriptor, contact/press/rights emails, social links, portrait (image path + dimensions + photographer credit), bios, background list, interview topics.
- `books.yaml` — one entry per book (title, series, publisher, dates, ISBN, cover image + dimensions, publisher URL, review quote, etc.).
- `current_work.yaml` — FEED (poetry manuscript) title/status/poem count.
- `site.yaml` — site-wide constants (base URL, nav structure).

Templates read from these — e.g. `{{ author.contact_email }}` — so a value only needs to change in one place.

## Real content vs. placeholder — current state

**Resolved (real values, not placeholders) as of 2026-09-29:**

- Contact / press / rights email: `mikaelviima@outlook.com` (same address for all three, per user's explicit choice)
- Instagram: `https://www.instagram.com/mikaelviima/` (linked on Contact and in the footer)
- Production domain: `www.mikaelviima.com` (see DNS section above)
- All three book covers — downloaded directly from WSOY's and Otava's own sites, see `src/assets/images/covers/*.jpg`, wired via `book.cover_image`/`cover_width`/`cover_height` in `books.yaml`
- Publisher links — each book's own page (`wsoy.fi/kirjat/verijalki`, `wsoy.fi/kirjat/rekyyli`, `otava.fi/kirjat/vaaralliset-gurut`), not just a generic author page. No English-language pages exist on either publisher's site yet — checked directly, don't assume one exists later without checking again.
- Author portrait — real photo at `src/assets/images/portrait.jpg`, wired via `author.portrait.image`/`width`/`height`. **Photographer credited**: Juha Törmälä, 2021, linked to `https://www.juhatormala.com/` (verified via web search as the correct Finnish portrait photographer). Copyright ownership is unresolved — WSOY paid for the shoot, actual rights status unconfirmed — the credit+backlink is a good-faith courtesy, not a legal clearance. Don't remove the credit or treat the rights question as settled.
- About page's `background` list also has the enriched, sourced-from-mannelaukkanen.fi details: PhD universities named, ResearchGate citation count linked, LinkedIn linked (low-key, per explicit user instruction not to feature it), and real musician detail (Finnish National Opera, the Guards Band/Kaartin Soittokunta, three-time World Pipe Band Championships competitor) replacing the old generic "Musician" bullet.

**Still placeholder / genuinely open:**

- Poetry excerpts — `poetry/index.njk`'s "Selected poems" section currently just says "Coming soon." (the old `{{POEM_1_TITLE}}`-style placeholder blocks were removed at the user's request). When the FEED selection is locked, add `.poem` blocks there (`.poem__title` + `<pre class="poem__body">`, CSS already exists). Do not invent sample poems. **Open idea from the user (2026-09-29), not decided:** show each poem as a screenshot of his own transparent bash terminal instead of as text. If that route is taken: include the full poem text for screen readers (not just a short alt), check legibility at ~400px phone width, and scrub the image of anything visible through the transparent background. Revisit when the poems arrive.
- Third Aarni Susi novel status, translation-rights status for the English market, any agent/representation info — brief explicitly says stay cautious/vague here (see brief §17) until these are publicly confirmed.

**Do not invent values for open items.** When the user supplies something, put it in the relevant `_data/*.yaml` file (or `src/assets/images/`), not scattered across templates.

**The real-vs-placeholder rendering pattern** (used for covers and portrait, extend it the same way for anything similar in future): a small macro in `src/_includes/partials/` (`cover-macro.njk`, `portrait-macro.njk`) checks whether the relevant `*_image` field is set — renders a real `<img>` with explicit `width`/`height` (avoids layout shift) if so, otherwise falls back to the CSS-only "archival plate" placeholder (fine grid background + rust corner registration marks, see `.cover--placeholder` / `.portrait-placeholder` in `style.css`). Never unconditionally swap placeholder markup for an `<img>` tag by hand — use/extend the macro pattern so the fallback keeps working if the asset is ever missing.

## Two gotchas hit while building this — don't reintroduce them

1. **Eleventy doesn't parse `.yaml` data files out of the box.** `.eleventy.js` registers `eleventyConfig.addDataExtension("yaml", ...)` via `js-yaml` — without it, every `_data/*.yaml` file silently returns empty and templates render blank with no build error. If data-driven pages start rendering empty again, check this first.
2. **Nunjucks `{% import %}` does not give the imported macro access to global template data (like `author`) unless you add `with context`.** The three book detail pages (`books/verijalki.njk` etc.) import `book-detail-macro.njk` `with context` for exactly this reason — the macro references `author.rights_contact`, which silently rendered as an empty string for a while (pre-dated this session, wasn't caught until a `mailto:` link made the emptiness visible) before this was found and fixed. Any new macro that reads global data (not just its own passed-in parameters) needs its import to say `with context`.
3. A publisher's book page HTML doesn't necessarily contain the actual cover `<img src>`. Otava's page has a static `<img>` labeled "photo of the author" (not the cover!), while the real cover loads lazily via `data-src` pointing at their media-bank API. Always visually verify a downloaded "cover" or "portrait" against the real thing before using it — don't trust a filename, alt text, or an automated page-summary tool's label.

## Voice discipline

The brief's "Copy clichés" list is a hard filter for any new copy: no "master storyteller," "award-winning" (unless named), "unique voice," "gripping page-turner," "journey," "weaving together," "at the intersection of," "delves into," "Nordic darkness," "from the frozen north," etc. Concrete beats abstract; implication beats adjectives. The user has directly flagged and cut generic-sounding lines before ("the explanations people invent after the fact" → "the things behind masks"; tautologies like a repeated "damage" in a list) — read new copy out loud and ask whether it sounds like it could appear on 5,000 other author sites before shipping it. Also see the poetry-first standing rule above.

## Person / point of view (standing rule, set by the user 2026-09-29)

**Third person for the record, first person for the voice.** Facts, credentials, bios, book copy, meta descriptions and anything a journalist or festival might copy-paste are third person ("Viima's doctoral work…", "He holds a PhD…"). First person ("I…") is allowed only where it is visibly set apart as the author speaking — a styled pull-quote (`.pull-quote`, or `.pull-quote--long` for longer lines) or a direct answer to a question heading (About's "Why write?"). Never put an "I" sentence in plain running body text next to "he" copy. Current first-person spots: Home pull-quote, Poetry page opening pull-quote, About "Why write?". **Exception: Notes (`/notes/`) is the author's diary and is first person throughout** — the rule applies to its list-page intro and meta copy, not to the notes themselves.

## Notes (diary) section

Built 2026-09-30. Each note is one Markdown file in `src/notes/`, named `YYYY-MM-DD-slug.md` — Eleventy takes the date from the filename prefix and the URL from the rest (`/notes/slug/`). Shared settings (layout, URL, SEO title, Article structured data, draft handling) live in `src/notes/notes.11tydata.js`; the list page is `src/notes-index.njk` (deliberately *outside* `src/notes/`, otherwise the directory data file hijacks its URL and layout). The `notes` collection is defined in `.eleventy.js`, newest first.

Front matter a note can use — only `title` is required:

```yaml
title: "…"
summary: "One line for the list page and meta description"
image: /assets/images/notes/2026-10-02-whatever.jpg   # lead image, shown above the text
image_alt: "…"
image_width: 1600      # give real pixel dimensions to avoid layout shift
image_height: 1200
image_caption: "…"
thumb: /assets/images/notes/…-thumb.jpg   # optional separate list-page thumbnail (e.g. when the lead image is a wide collage)
thumb_position: "50% 90%"   # optional: where the 4:3 list-page thumbnail crops (CSS object-position; default centre)
audio: /assets/audio/2026-10-02-gass.mp3             # plain <audio>, preload none, never autoplay
audio_duration: "6:40"
draft: true            # visible in `npm run dev` (tagged "Draft"), excluded from the live build
```

**Phone photos carry GPS coordinates in their metadata — never publish an original.** Put originals in the gitignored `originals/` folder at the repo root (anything under `src/assets/` gets published), then save a web copy: EXIF stripped, longest edge ~1600px, JPEG q≈82, colour (ICC) profile kept. The first two notes (Floor.jpg, PoemStack.JPEG, 2026-09-30) were handled this way. Poems inside a note go in a fenced ``` block — Markdown otherwise joins single line breaks into one paragraph; `.note__body pre` styles fenced blocks like `.poem__body` (mono, exact whitespace). Extra images inside the text use normal Markdown `![alt](/assets/images/notes/…)`. Note images go in `src/assets/images/notes/`, audio in `src/assets/audio/` (voice at ~64 kbps mono ≈ 0.5 MB/min; move audio to external object storage if the repo grows large — never embed SoundCloud/YouTube/Spotify players, they bring third-party tracking).

The "Notes" nav item and the sitemap entries appear **automatically** once at least one non-draft note exists (`requires_collection: "notes"` in `site.yaml`, checked in `header.njk`). Until then `/notes/` exists but is unlinked and shows "Coming soon." **RSS/Atom feed** at `/notes/feed.xml` (`src/notes-feed.njk`), linked from the list page and auto-discoverable via a `<link rel="alternate">` in `base.njk` (only once notes exist). It's a hand-written template using `@11ty/eleventy-plugin-rss`'s filters — not the plugin's ready-made feed, which would drop lead images/audio (they live in front matter, not the body) and reverse our newest-first collection. Notes with `audio` get an Atom enclosure, so the feed already works as a basic podcast feed in most readers; a proper podcast listing (Apple/Spotify) would need an RSS 2.0 feed with iTunes tags — not built. The plugin is ESM-only, hence the async `module.exports` and dynamic `import()` in `.eleventy.js`.

Copyright caution for readings: recording and publishing long passages of in-copyright authors (e.g. William Gass, d. 2017) needs permission; short quoted passages inside the author's own commentary are the safe pattern.

## Repo structure

```
src/
  _data/                        # author.yaml, books.yaml, current_work.yaml, site.yaml
  _includes/
    layouts/base.njk
    partials/
      header.njk, footer.njk, seo.njk
      wind-mark.njk              # recurring inline-SVG brand motif, see below
      cover-macro.njk            # real book cover <img> vs. placeholder
      portrait-macro.njk         # real author portrait <img> vs. placeholder
      book-detail-macro.njk      # shared markup for the 3 book detail pages (import "with context")
    layouts/note.njk             # single diary note
  assets/
    css/style.css
    fonts/                       # self-hosted woff2
    images/
      portrait.jpg               # real author photo
      covers/*.jpg               # real book covers (verijalki, rekyyli, vaaralliset-gurut)
    js/nav.js                    # mobile nav toggle, ~10 lines
  notes/                         # diary entries, YYYY-MM-DD-slug.md + notes.11tydata.js
  notes-index.njk                # /notes/ list page (kept outside notes/ on purpose)
  index.njk                      # Home
  poetry/index.njk               # FEED
  books/index.njk
  books/verijalki.njk, rekyyli.njk, vaaralliset-gurut.njk
  about/index.njk
  contact/index.njk
  press/index.njk
  404.njk
  sitemap.njk                    # outputs sitemap.xml
  robots.txt
  CNAME                          # custom domain, passthrough-copied every build
  debug/                         # gitignored scratch space for troubleshooting screenshots — never commit this
.eleventy.js
```

## Conventions

- Poetry text must preserve exact whitespace/lineation — always render poem bodies inside a `<pre>`-based component with the monospace font, never through a Markdown pipeline that normalizes whitespace.
- Motion: only subtle underline/color transitions (~150-200ms). Respect `prefers-reduced-motion`. The grain texture and wind-mark motif are static, not animated — keep them that way.
- Every new page needs: SEO title, meta description, canonical URL, OG tags — via the shared `seo.njk` partial, not copy-pasted `<head>` blocks.
- Finnish books get `inLanguage: Finnish` (or `fi` in schema.org structured data) — never mark them `en` just because the surrounding site copy is English.
- Before editing book/author facts, check the brief's canonical metadata section — it's the source of truth for publication dates/ISBNs/etc., cross-checked against publisher records.

## Design additions beyond the brief

The brief's literal typography/color spec, rendered as-written, looked flat — quiet-to-the-point-of-generic ("made with Word" was the user's exact phrase) rather than "editorial." Since the brief isn't a design authority (see caveat above), these were added on top of it:

- **Much higher type-scale contrast**: hero name at `clamp(3.5rem, 11vw, 8.5rem)`, weight 700, tight (`-0.03em`) tracking. Section headings and pull-quotes similarly pushed larger/tighter/heavier. Pull-quotes render in italic Newsreader. If it starts looking flat again, push scale/weight/tracking further before reaching for a different typeface — the font choices themselves are fine, they just need to be used with more contrast/confidence.
- **Wind-line motif** (`wind-mark.njk`): recurring inline-SVG thin diagonal sweeping lines, used as the site's signature graphic on every dark hero/section (`.motif-host` class + the partial include). Ties directly to "Viima" meaning a cutting wind, rather than being generic decoration. Reuse this on new dark sections; don't invent a different motif.
- **Grain texture** (`body::after` in `style.css`): fixed, static, very-low-opacity SVG noise overlay for "carbon paper" tactility. Static, so it doesn't conflict with the motion restrictions.
- **Archival-plate placeholder treatment**: pending-art slots (`.cover--placeholder`, `.portrait-placeholder`) get a fine grid background + small rust corner registration marks instead of a flat gray box, so "pending" reads as intentional. Real images drop this treatment (see the macro pattern above).
- **Confident rust accent** (2026-09-29 pass): the single accent color was technically present from the start but nearly invisible (1px link underlines, 14px corner ticks) and read as timid rather than restrained. Now: primary CTA buttons are solid rust fill (not outline) with white text; section-kicker labels get a bold 3px rust rule underneath; pull-quotes get a 4px rust left border; nav active/hover underline doubled to 2px. Still exactly one accent color, still a small percentage of any given page — the brief's "red is an accent, not a theme, not a black-and-red thriller" rule is still respected, this was about confidence in the few places it appears, not expanding where it appears. Don't add a second accent color without the user asking.

None of this changes brief-mandated content, copy, brand hierarchy, or the palette's actual hex values — only how confidently the existing tokens are used.

## Commands

- `npm run dev` — Eleventy dev server with live reload (`npx eleventy --serve`).
- `npm run build` — production build to `_site/`.
- **Run build commands from the repo root.** If a build suddenly reports "Wrote 0 files" with no error, check `pwd` first — Eleventy silently falls back to default config (treats `.` as input, finds nothing) if run from the wrong directory (e.g. after a `cd` into `src/assets/images` that didn't get undone). Not a real bug, just a shell-state trap.

## Status

Launch scope = brief's minimum viable site: Home, Poetry (FEED), Books (+ 3 book pages), About, Contact. Press page included as a bonus.

**Live and real**: domain, DNS, HTTPS (once cert finishes provisioning), all contact/social links, all three book covers, the author portrait with photographer credit, poetry-first copy throughout, the confident-rust design pass.

**Still outstanding**: FEED's poem excerpts (manuscript not locked), third Aarni Susi novel status, English-market translation rights status, and resolving (or formally accepting as-is) the portrait's copyright/usage-rights question with WSOY/Juha Törmälä. Check this section and update it as those arrive — and update the brief's own amendment note at the same time if a genuinely new fact gets resolved.
