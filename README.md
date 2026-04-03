# The Seven2 Hacks-a-Thon

**Live:** [hacks.murtopolis.com](https://hacks.murtopolis.com)
**Repo:** [github.com/murtopia/hacks-a-thon](https://github.com/murtopia/hacks-a-thon)

A public-facing event website for the Seven2 Hacks-a-Thon — a company-wide, time-blocked experiment where every employee at Seven2 builds a solo project using AI. The site serves as a step-by-step guidebook during the event, then transitions into a public case study. A Murtopolis Venture.

---

## Architecture

The site is a **multi-page Vite application** with four HTML entry points, all built with vanilla TypeScript and pure CSS. Data comes from two separate Supabase instances. Hosted on Vercel with auto-deploy from `main`.

### Pages

| Route | File | Purpose | Access |
|---|---|---|---|
| `/` | `index.html` | Public marketing site and event guidebook | Public |
| `/vote` | `vote.html` | Hacky Awards ballot — pick one winner per category | Team passcode (`seven2hacks` default) |
| `/admin` | `admin.html` | Dashboard for managing voting, awards, reflections, passcodes | Admin passcode (`hackyadmin` default) |
| `/reflect` | `reflect.html` | 7-question reflection form for participants | Reflect passcode (`seven2reflect` default) |

The `/vote`, `/admin`, and `/reflect` pages are `noindex` — they won't appear in search engines.

### Tech Stack

- **Build:** [Vite](https://vite.dev) multi-page build + vanilla TypeScript
- **Styling:** Pure CSS with custom properties (no frameworks)
- **Data:** [@supabase/supabase-js](https://supabase.com) connecting to two databases
- **Fonts:** EB Garamond, Inter, JetBrains Mono (Google Fonts)
- **Hosting:** [Vercel](https://vercel.com) with auto-deploy from `main`
- **Design:** Inspired by Massimo Vignelli's *The Vignelli Canon*

---

## Data Architecture

### IdeaLab Supabase (read-only)

The [IdeaLab](https://idealab.seven2.com) app is where Seven2 employees submit project ideas. This site reads from its `ideas` table, filtered to the Seven2 organization (`organization_id = '16a200e8-7125-47f3-b694-063f5bf53479'`). The vote ballot also reads from IdeaLab to display eligible projects.

**Table used:** `ideas` — title, pitch, description, submitter, status, project_url

### Hacksathon Supabase (read/write)

A dedicated Supabase instance for all event-specific data, voting, and reflections.

| Table | Purpose |
|---|---|
| `blocks` | Event phases/timeline (8 blocks from Kickoff to Showcase) |
| `awards` | The Hacky Awards — 6 categories with winner slots |
| `reflections` | Participant reflection responses with featured flag |
| `downloadable_assets` | PDFs, templates, and resources (post-event) |
| `voting_config` | Singleton row: voting open/closed, passcodes, deadline |
| `votes` | Individual ballot entries (voter + category + project) |
| `excluded_projects` | Projects marked ineligible for voting |

### SQL Migrations

Three migration files, applied in order on a fresh database:

1. **`supabase/migration.sql`** — Base schema: `blocks`, `awards`, `reflections`, `downloadable_assets` tables with public SELECT RLS and seed data (8 blocks, original 6 award categories)
2. **`supabase/voting-migration.sql`** — Replaces award categories with final 6, adds `voting_config`, `excluded_projects`, `votes` tables, RLS policies, and all voting/admin RPC functions
3. **`supabase/reflections-migration.sql`** — Adds `reflect_passcode` to `voting_config`, unique constraint on `reflections(participant_name, question)`, INSERT/UPDATE policies on `reflections`, and reflection RPC functions

### RPC Functions (SECURITY DEFINER)

All sensitive operations run through Supabase RPC functions so passcodes are never exposed to the client.

| Function | Purpose |
|---|---|
| `verify_vote_passcode(code)` | Returns `{ valid, voting_open, deadline }` |
| `verify_admin_passcode(code)` | Returns boolean |
| `verify_reflect_passcode(code)` | Returns `{ valid }` |
| `get_voting_config(admin_code)` | Returns all config values (admin-gated) |
| `toggle_voting(admin_code, is_open)` | Open/close voting |
| `set_voting_deadline(admin_code, deadline)` | Set deadline text |
| `update_vote_passcode(admin_code, new_passcode)` | Change vote passcode |
| `update_admin_passcode(admin_code, new_passcode)` | Change admin passcode |
| `update_reflect_passcode(admin_code, new_passcode)` | Change reflect passcode |
| `toggle_exclusion(admin_code, project_id, title, exclude)` | Mark project eligible/ineligible |
| `announce_winner(admin_code, category, winner, project, url)` | Write winner to awards table |
| `toggle_featured(admin_code, reflection_id, featured)` | Feature/unfeature a reflection |

### Security Model

- **`voting_config`** has no public RLS policies — it can only be read via the `get_voting_config` RPC (which requires the admin passcode)
- All admin actions (toggle voting, announce winners, change passcodes, feature reflections) are gated by `admin_passcode` inside SECURITY DEFINER functions
- Vote and reflect passcodes are verified server-side; the client never sees stored passcode values
- Default passcodes should be changed via the admin dashboard before going live

---

## Project Structure

```
hacksathon-site/
├── index.html                    # Marketing site with all public sections
├── vote.html                     # Hacky Awards ballot (noindex)
├── admin.html                    # Admin dashboard (noindex)
├── reflect.html                  # Reflection form (noindex)
├── public/
│   ├── favicon.svg               # "H" favicon
│   ├── og-image.png              # 1200x630 social sharing image
│   ├── og-image.svg              # SVG source of OG image
│   ├── s2-lovable-lockup.png     # Seven2 x Loveable full logo lockup (transparent PNG)
│   └── s2-lovable-icons.png      # Seven2 x Loveable icons only
├── src/
│   ├── main.ts                   # Main site entry: imports CSS, initializes all modules
│   ├── vote.ts                   # Vote page entry: imports CSS, initializes ballot
│   ├── admin.ts                  # Admin page entry: imports CSS, initializes dashboard
│   ├── reflect.ts                # Reflect page entry: imports CSS, initializes form
│   ├── vite-env.d.ts             # TypeScript declarations for VITE_ env vars
│   ├── shared/
│   │   ├── categories.ts         # 6 award categories (key, name, description)
│   │   └── questions.ts          # 7 reflection questions
│   ├── sections/
│   │   ├── projects.ts           # IdeaLab project cards + detail modal
│   │   ├── awards.ts             # Hacky Awards rendering (winners from DB)
│   │   └── reflections.ts        # Featured reflection quotes
│   ├── vote/
│   │   └── ballot.ts             # Passcode gate, project selection, vote submission
│   ├── admin/
│   │   └── dashboard.ts          # Settings, eligibility, voters, results, announce, reflections
│   ├── reflect/
│   │   └── form.ts               # Passcode gate, 7-question form, upsert, confirmation
│   ├── supabase/
│   │   ├── idealab-client.ts     # IdeaLab Supabase client
│   │   ├── hacksathon-client.ts  # Hacksathon Supabase client (nullable if env vars missing)
│   │   ├── queries.ts            # Typed queries for IdeaLab ideas, awards, reflections
│   │   └── vote-queries.ts       # All voting, admin, and reflection RPC calls
│   ├── styles/
│   │   ├── tokens.css            # Design tokens: colors, spacing, type scale, transitions
│   │   ├── base.css              # Reset, body defaults, selection, scroll-padding
│   │   ├── grid.css              # 12-column grid system
│   │   ├── typography.css        # Heading styles, .mono-label, .lead, .subsection-title
│   │   ├── components.css        # Cards, badges, timeline, modal, project cards
│   │   ├── sections.css          # Nav, hero, footer, section layouts, lockup links
│   │   ├── animations.css        # Scroll-triggered fade-ins
│   │   ├── vote.css              # Vote page and "Vote for the Hackies" CTA on main site
│   │   ├── admin.css             # Admin dashboard styles
│   │   └── reflect.css           # Reflect form and "Share Your Reflections" CTA on main site
│   └── utils/
│       ├── scroll.ts             # IntersectionObserver for fade-in animations
│       ├── expand.ts             # Checklist expand/collapse
│       └── nav.ts                # Mobile nav toggle, active section highlighting
├── supabase/
│   ├── migration.sql             # Base schema + seed data
│   ├── voting-migration.sql      # Voting system: tables, RLS, RPCs
│   └── reflections-migration.sql # Reflections system: column, constraint, RLS, RPCs
├── vercel.json                   # Vercel config: rewrites for /vote, /admin, /reflect
├── vite.config.ts                # Multi-page build config (4 HTML inputs)
├── tsconfig.json
├── package.json
├── PLANNING.md                   # Long-form project reference and event playbook
└── README.md                     # This file
```

---

## Environment Variables

Required in `.env.local` (local dev) and Vercel dashboard (production):

```
VITE_IDEALAB_SUPABASE_URL=https://pplbzzrbyrkqajkiuzfx.supabase.co
VITE_IDEALAB_SUPABASE_ANON_KEY=[jwt-token]
VITE_HACKSATHON_SUPABASE_URL=https://rzbmylyeacmjkipmpmwh.supabase.co
VITE_HACKSATHON_SUPABASE_ANON_KEY=[jwt-token]
```

The Hacksathon variables are optional in code — if missing, the Supabase client returns `null` and all vote/reflect/admin functions gracefully return empty/false.

---

## Local Development

```bash
npm install
npm run dev     # starts at http://localhost:3000
npm run build   # production build to dist/
```

All four pages are accessible locally: `localhost:3000`, `localhost:3000/vote.html`, `localhost:3000/admin.html`, `localhost:3000/reflect.html`.

---

## Main Site Sections

1. **Hero** — Event title, tagline, metadata grid, philosophy quote
2. **The Plan** — Roles (Nick/Callen/Everyone), outcomes, success definition
3. **The Blocks** — Interactive timeline of all 8 event phases with expandable checklists
4. **Projects** — Live project cards from IdeaLab with click-to-open detail modal
5. **The Hacky Awards** — 6 award categories with "Vote for the Hackies" CTA linking to `/vote`
6. **Reflections** — 7 reflection questions, "Share Your Reflections" CTA linking to `/reflect`, featured quotes
7. **Run Your Own** — Framework for other companies to replicate the format
8. **Footer** — Seven2 x Loveable branding, links, "A Murtopolis Venture"

---

## Hacky Awards — 6 Categories

| Award | Key | Description |
|---|---|---|
| Best in Show | `best-in-show` | The overall standout |
| Shut Up and Take My Money | `take-my-money` | The one everyone actually wants to use |
| Best Execution | `execution` | Cleanest build quality and implementation |
| Most Creative Idea | `creative` | The idea that surprised everyone |
| Best Shark Tank Pitch | `shark-tank` | Best presentation and storytelling during demos |
| Most Seven2 Energy | `seven2-energy` | Creative, bold, and fun — pure Seven2 spirit |

Voting is blind (voters cannot see results). Same project can win multiple categories. Ties result in shared awards.

---

## Reflection Questions

1. What surprised you the most about the experience?
2. What do you wish you'd known before your very first prompt?
3. What did you discover about your own creative process along the way?
4. Did this unlock any ideas you're actually going to pursue?
5. Did this change how you think about AI, vibe coding, or what's possible for you creatively?
6. What advice would you give to another Seven2 creative who's nervous to start?
7. What one thing — a tool, a resource, a mindset shift — would help future Seven2 creatives jump in faster?

Responses are stored per-question per-participant with upsert support (participants can update answers anytime). Admin can toggle individual answers as "featured" to display them on the main site.

---

## Admin Dashboard (`/admin`)

The admin dashboard provides full control without needing the Supabase dashboard:

- **Voting Settings** — Open/close voting, set deadline, view/change vote passcode, view/change reflect passcode, change admin passcode
- **Project Eligibility** — Toggle IdeaLab projects on/off the ballot
- **Voter Roll Call** — See who has voted and how many categories they completed
- **Reflections** — View all submissions grouped by participant, expand to read full answers, toggle individual answers as featured
- **Results by Category** — Vote tallies with bar charts, individual voter names per project
- **Announce Winners** — One-click to write the winner to the awards table (updates main site immediately)

---

## Operational Playbook

### Before the event
1. Change default passcodes via `/admin` settings
2. Ensure voting is closed (default state)

### During voting
1. Open voting from `/admin`
2. Share the vote passcode and `/vote` URL with the team
3. Optionally set a deadline string (displayed to voters)
4. Monitor voter roll call and results in real-time

### Announcing winners
1. Close voting
2. Review results by category in `/admin`
3. Click "Announce Winner" for each category — this writes to the `awards` table and updates the main site immediately

### Collecting reflections
1. Share the reflect passcode and `/reflect` URL with the team
2. Participants can submit and re-edit anytime
3. Review submissions in the admin Reflections section
4. Toggle standout answers as "featured" — they appear on the main site instantly

---

## Vercel Configuration

`vercel.json` configures the multi-page app:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: `vite`
- Rewrites: `/vote` → `/vote.html`, `/admin` → `/admin.html`, `/reflect` → `/reflect.html`

---

## Design System

The visual design draws from Massimo Vignelli's principles:

- **Grid:** 12-column modular grid with 8px base spacing
- **Typography:** EB Garamond (serif headings), Inter (sans-serif body), JetBrains Mono (labels/numbers)
- **Color:** Minimal black/gray palette on white, with Loveable's gradient reserved for accents
- **Layout:** Content-driven, generous whitespace, strong alignment, clear hierarchy

---

## Branding

- **Seven2** — [seven2.com](https://seven2.com) — Creative digital agency, Spokane WA
- **Loveable** — [lovable.dev](https://lovable.dev) — AI-powered no-code app builder
- **Murtopolis** — [murtopolis.com](https://murtopolis.com) — Parent venture by Nick Murto

---

## Pending Items

- **PostHog Analytics** — Not yet implemented. Track pageviews, section engagement, modal opens, project clicks.
- **Downloadable PDFs** — Design and create post-event: Playbook, Checklist, Reflection Questions, Case Study Summary.
