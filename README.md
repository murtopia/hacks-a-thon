# The Seven2 Hacks-a-Thon

**Live:** [hacks.murtopolis.com](https://hacks.murtopolis.com)

A public-facing event website for the Seven2 Hacks-a-Thon — a focused, time-blocked experiment designed to help everyone at Seven2 learn how to build with AI using [Loveable](https://lovable.dev). Built as a step-by-step guidebook during the event, then transitions into a case study showcasing the structure, results, and learnings.

A Murtopolis Venture.

---

## Tech Stack

- **Build:** [Vite](https://vite.dev) + vanilla TypeScript
- **Styling:** Pure CSS with custom properties (no frameworks)
- **Data:** [Supabase](https://supabase.com) JS client connecting to two databases
- **Fonts:** EB Garamond, Inter, JetBrains Mono (Google Fonts)
- **Hosting:** [Vercel](https://vercel.com) with auto-deploy from `main`
- **Design:** Inspired by Massimo Vignelli's *The Vignelli Canon*

## Data Architecture

The site reads from two Supabase instances:

### IdeaLab Supabase (existing, read-only)

The [IdeaLab](https://idealab.seven2.com) project is a separate Loveable-built app where Seven2 employees submit and refine their project ideas. This site reads from its `ideas` table, filtered to the Seven2 organization.

**Table used:** `ideas` — title, pitch, description, submitter, status, project_url

### Hacksathon Supabase (dedicated)

A dedicated Supabase project for event-specific data.

| Table | Purpose |
|---|---|
| `blocks` | Event phases/timeline (8 blocks from Kickoff to Showcase) |
| `awards` | The Hacky Awards — 6 categories with winner slots |
| `reflections` | Participant reflection responses with featured flag |
| `downloadable_assets` | PDFs, templates, and resources (post-event) |

All tables have public read-only RLS policies. The schema and seed data are in [`supabase/migration.sql`](supabase/migration.sql).

## Project Structure

```
hacksathon-site/
├── index.html                  # Single-page site with all sections
├── public/
│   ├── favicon.svg             # "H" favicon
│   ├── og-image.svg            # Open Graph social sharing image
│   ├── s2-lovable-lockup.png   # Seven2 x Loveable full logo lockup
│   └── s2-lovable-icons.png    # Seven2 x Loveable icons only
├── src/
│   ├── main.ts                 # Entry point — initializes all modules
│   ├── vite-env.d.ts           # TypeScript env declarations
│   ├── sections/
│   │   ├── projects.ts         # IdeaLab project cards + detail modal
│   │   ├── awards.ts           # Hacky Awards rendering
│   │   └── reflections.ts      # Featured reflection quotes
│   ├── supabase/
│   │   ├── idealab-client.ts   # IdeaLab Supabase connection
│   │   ├── hacksathon-client.ts # Hacksathon Supabase connection
│   │   └── queries.ts          # Typed queries for all tables
│   ├── styles/
│   │   ├── tokens.css          # Design tokens (colors, spacing, type scale)
│   │   ├── base.css            # Reset, defaults
│   │   ├── grid.css            # 12-column grid system
│   │   ├── typography.css      # Type styles, font loading
│   │   ├── components.css      # Cards, badges, timeline, modal
│   │   ├── sections.css        # Nav, hero, footer, section layouts
│   │   └── animations.css      # Scroll-triggered fade-ins
│   └── utils/
│       ├── scroll.ts           # IntersectionObserver for animations
│       ├── expand.ts           # Checklist expand/collapse
│       └── nav.ts              # Mobile nav toggle, active section
├── supabase/
│   └── migration.sql           # Full schema + seed data for Hacksathon DB
├── vercel.json                 # Vercel deployment config
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Environment Variables

Required in `.env.local` (local dev) and Vercel dashboard (production):

```
VITE_IDEALAB_SUPABASE_URL=https://[project-id].supabase.co
VITE_IDEALAB_SUPABASE_ANON_KEY=[anon-key]
VITE_HACKSATHON_SUPABASE_URL=https://[project-id].supabase.co
VITE_HACKSATHON_SUPABASE_ANON_KEY=[anon-key]
```

## Local Development

```bash
npm install
npm run dev     # starts at http://localhost:3000
npm run build   # production build to dist/
```

## Site Sections

1. **Hero** — Event title, tagline, metadata grid, philosophy quote
2. **The Plan** — Roles (Nick/Callen/Everyone), outcomes, success definition
3. **The Blocks** — Interactive timeline of all 8 event phases with expandable checklists
4. **Projects** — Live project cards from IdeaLab with click-to-open detail modal
5. **The Hacky Awards** — 6 award categories (winners populated post-event)
6. **Reflections** — 7 reflection questions + featured quotes (post-event)
7. **Run Your Own** — Framework for other companies to replicate the format
8. **Footer** — Seven2 x Loveable branding, links, "A Murtopolis Venture"

## Post-Event Updates

After the Showcase Showdown, update via the Supabase dashboard:

- **Award winners:** Update `winner_name`, `project_title`, and `project_url` in the `awards` table
- **Featured reflections:** Insert responses into `reflections` table, set `is_featured = true` for quotes to display
- **Block status:** Update `status` column in `blocks` table to `completed`
- **Downloads:** Add PDF URLs to `downloadable_assets` table

## Design System

The visual design draws from Massimo Vignelli's principles:

- **Grid:** 12-column modular grid with 8px base spacing
- **Typography:** EB Garamond (serif headings), Inter (sans-serif body), JetBrains Mono (labels/numbers)
- **Color:** Minimal black/gray palette on white, with Loveable's gradient reserved for accents
- **Layout:** Content-driven, generous whitespace, strong alignment, clear hierarchy

## Branding

- **Seven2** — [seven2.com](https://seven2.com) — Creative digital agency, Spokane WA
- **Loveable** — [lovable.dev](https://lovable.dev) — AI-powered no-code app builder
- **Murtopolis** — [murtopolis.com](https://murtopolis.com) — Parent venture by Nick Murto
