# The Seven2 Hacks-a-Thon — Complete Project Reference

**Live:** https://hacks.murtopolis.com
**Repo:** https://github.com/murtopia/hacks-a-thon
**Hacksathon Supabase:** https://supabase.com/dashboard/project/rzbmylyeacmjkipmpmwh
**IdeaLab Supabase:** https://supabase.com/dashboard/project/pplbzzrbyrkqajkiuzfx

---

## 1. Project Overview

### What This Is

A public-facing website for the Seven2 Hacks-a-Thon -- a company-wide, time-blocked experiment where every employee at Seven2 builds a solo project using AI tools over 2-3 weeks. The site serves two purposes:

1. **During the event:** A step-by-step guidebook employees follow as they move through each phase, from ideation to live demo.
2. **After the event:** A public case study showcasing the structure, participant projects, award winners, reflections, and downloadable resources so other companies can replicate the format.

### Why It Exists

Seven2 is a creative digital agency. Most of the team are not programmers -- they're designers, strategists, content creators, and project managers. The Hacks-a-Thon is designed to demystify AI-powered building and give everyone a hands-on experience creating something real. The name itself sets the tone: "We're all just hacks. And that's kind of the point."

### The Three Brands

- **Seven2** (seven2.com) -- The creative digital agency running the event. Founded in Spokane, WA. Specializes in online advertising, audience engagement, social content, videos, and websites. Clients include AT&T, Netflix, Nickelodeon, Disney, and MTV.
- **Loveable** (lovable.dev) -- The AI-powered no-code app builder platform. Every participant uses Loveable to build their project. Built on React, Supabase, and Tailwind CSS. Seven2 provides each participant with a Loveable subscription.
- **Murtopolis** (murtopolis.com) -- Nick Murto's parent venture entity. The Hacks-a-Thon site is branded as "A Murtopolis Venture." The site's design system and deployment infrastructure come from Murtopolis.

### Key People

- **Nick Murto** -- Facilitator. Runs the kickoff, office hours, Q&A, the final showcase, and reflection questions. Owner of Murtopolis. Leadership at Seven2.
- **Callen** -- Logistics coordinator. Handles calendar blocking, meeting setup, recording transcripts, and coordination.
- **Everyone else at Seven2** -- Participants/builders. Each person builds a solo project, updates IdeaLab, demos at the showcase, and shares reflections.

---

## 2. The Event Playbook

The Hacks-a-Thon is structured into focused, calendar-blocked phases over a 2-3 week window. Each block moves participants from idea to live demo while staying integrated into the normal rhythm of work. Daily Status meetings are used for lightweight check-ins after each major phase.

### Block Zero: Kickoff (15 min)
- **What:** Introduce Loveable, explain vibe coding, set expectations, outline the structure
- **Purpose:** Remove intimidation and create clarity before ideas begin
- **Checklist (Before):** Calendar invite sent, recording enabled, Loveable demo prepared, account setup instructions ready, helpful YouTube links ready, Slack channel (#hacks-a-thon) created, IdeaLab instructions shared
- **Checklist (During):** Record session, share Loveable resources in Slack, reinforce passion-driven projects
- **Checklist (After):** Share recording with Nick, confirm subscription access for all
- **Next Day Check-In:** Quick reactions and initial thoughts

### Block 1: Sprint to the IdeaLab (30 min)
- **What:** Brainstorm, define, and submit project idea at idealab.seven2.com
- **Purpose:** Commit to a direction and articulate why the idea matters
- **Participant Requirements:** Idea title, who it's for, problem it solves, why it matters to you, initial direction, use AI to help you AI
- **Next Day Check-In:** Share the title of your idea (teaser only)

### Block 2: Shark Tank, Minus the Sharks (45 min)
- **What:** Each participant delivers a 1-minute pitch with light team feedback
- **Purpose:** Sharpen ideas and build collective energy
- **Format:** Pitch order follows Status meeting order. Timer with 50-second warning tone. 60-second hard cutoff.
- **Next Day Check-In:** Did your idea change after getting feedback?

### Block 3: Documentation Is Everything (30 min)
- **What:** Develop specifics using AI, ZERO.Prmptr.ai, IdeaLab, or all three
- **Purpose:** Translate the idea into a low-prompt, buildable direction
- **Participant Requirements:** Refined build direction, defined first milestone, updated IdeaLab entry
- **Next Day Check-In:** What are you building first?

### Block 4A: Here We Go! (45 min)
- **What:** Start building in Loveable
- **Purpose:** Jumpstart development
- **Support:** Office hours Zoom open, Slack progress posts encouraged
- **Participant Requirements:** Begin building, publish early working version (even rough)
- **Next Day Check-In:** What did you get working?

### Block 4B: Build Session 2 (45 min)
- **What:** Protected build time with optional office hours
- **Purpose:** Iterate and improve
- **Participant Requirements:** Improve functionality, refine demo flow
- **Next Day Check-In:** What improved?

### Block 4C: Your Final Build Session (45 min)
- **What:** Last time-blocked build session (free to continue in free time)
- **Purpose:** Polish demo flow and prepare for showcase
- **Participant Requirements:** Final Loveable URL ready, IdeaLab updated with live link, 3-minute demo prepared
- **Next Day Check-In:** Are you demo-ready?

### Final Block: Showcase Showdown (2 x 60 min)
- **What:** Each participant presents a 3-minute (or less) demo + 2-minute Q&A
- **Purpose:** Celebrate learning, reflect on insights, capture takeaways
- **Before:** Demo order finalized, meeting link distributed, recording enabled, all project URLs verified
- **During:** Enforce time limits, capture standout quotes, ask reflection questions
- **Participant Requirements:** Demo, final link in IdeaLab, summary form completed

### Expected Outcomes
Every participant will have:
- Built a live prototype
- Updated IdeaLab with their project URL
- Demonstrated their work
- Reflected on what they learned

**Success is defined by participation, momentum, and growth -- not perfection.**

---

## 3. The Hacky Awards

Six award categories, voted on by the full team via a blind ballot at `/vote` and announced from the admin dashboard:

| Award | Key | Description |
|---|---|---|
| Best in Show | `best-in-show` | The overall standout |
| Shut Up and Take My Money | `take-my-money` | The one everyone actually wants to use |
| Best Execution | `execution` | Cleanest build quality and implementation |
| Most Creative Idea | `creative` | The idea that surprised everyone |
| Best Shark Tank Pitch | `shark-tank` | Best presentation and storytelling during demos |
| Most Seven2 Energy | `seven2-energy` | Creative, bold, and fun — pure Seven2 spirit |

**Voting mechanics:** Each voter picks one project per category. Same project can win multiple awards. Ties result in shared awards. Voting is completely blind — voters cannot see results until winners are announced by the admin. A team passcode gates access to the ballot. The admin can open/close voting, set a deadline, and exclude specific projects from the ballot.

---

## 4. Reflection Questions

Each participant submits answers via a dedicated form at `/reflect`, gated by a separate passcode. Responses are stored per-question per-participant with upsert support (participants can update their answers anytime). Responses may be used for internal recap, case study, LinkedIn content, and future book material.

1. What surprised you the most about the experience?
2. What do you wish you'd known before your very first prompt?
3. What did you discover about your own creative process along the way?
4. Did this unlock any ideas you're actually going to pursue?
5. Did this change how you think about AI, vibe coding, or what's possible for you creatively?
6. What advice would you give to another Seven2 creative who's nervous to start?
7. What one thing — a tool, a resource, a mindset shift — would help future Seven2 creatives jump in faster?

The admin can toggle individual answers as "featured" from the dashboard, which immediately displays them on the main site's reflections section.

---

## 5. What Was Built (Site Sections)

### Navigation (sticky)
- Full Seven2 x Loveable logo lockup (transparent PNG) with split clickable regions: left half links to seven2.com, right half links to lovable.dev
- Section anchor links: The Plan, Blocks, Projects, Awards, Reflections, Run Your Own
- Mobile hamburger menu at 768px breakpoint
- Frosted glass effect (backdrop-filter blur) with semi-transparent white background
- Active section highlighting via IntersectionObserver

### Hero
- Large Garamond headline: "The Seven2 Hacks-a-Thon"
- Italic subtitle: "We're all just hacks. And that's kind of the point."
- Structured metadata grid: Duration (2-3 Weeks), Platform (Loveable), Format (Solo Builds), Participation (Everyone)
- Philosophy blockquote from the playbook
- Fade-in scroll animations on all elements

### The Plan (Section 01)
- Lead paragraph about the playbook structure
- Three-column role grid: Nick (Facilitation), Callen (Logistics), Everyone (Builders) -- each with a list of responsibilities
- Outcomes list with diamond bullet markers
- Closing coda: "Success is defined by participation, momentum, and growth -- not perfection."

### The Blocks (Section 02)
- Vertical timeline with 8 block cards connected by a continuous line
- Each block card shows: monospace block number (ZERO, 01, 02, 03, 4A, 4B, 4C, FINAL), title, duration badge, purpose description, italic intent statement
- Expandable/collapsible checklists per block with Before/During/After/Next Day Check-In groups
- Checkbox-style list items, check-in sections highlighted with a left border and gray background
- Responsive: stacks vertically on mobile

### Projects (Section 03)
- Dynamic project card grid pulled from IdeaLab Supabase, filtered to Seven2 organization only (org ID: `16a200e8-7125-47f3-b694-063f5bf53479`)
- Each card shows: status badge (Ideating/Building/Complete), title, submitter name, pitch text, "View Details" label
- Click-to-open modal with full project details: status, title, submitter, pitch, full description, "View Live Project" link (when available)
- Modal includes Seven2 x Loveable icons as a branding element at the bottom (100% opacity, fades to 40% on hover)
- Modal closes on backdrop click, X button, or Escape key
- Placeholder dashed card shown when no projects exist

### The Hacky Awards (Section 04)
- Six award category cards in a 3-column grid
- Each card: diamond icon, category title, winner name (or "TBD" before announcement)
- Winners dynamically populated from Hacksathon Supabase `awards` table when `winner_name` is set
- Announced winner styling: bolder text, optional project link
- "Vote for the Hackies" CTA button linking to `/vote`

### Reflections (Section 05)
- All 7 reflection questions displayed as a numbered list with monospace counters
- "Share Your Reflections" CTA button linking to `/reflect`
- Featured quotes section populated from Hacksathon Supabase `reflections` table where `is_featured = true` (toggled by admin)
- Quote rendering: large serif pull-quote text with author attribution and question context

### Run Your Own (Section 06)
- "Want to run a Hacks-a-Thon at your company?" framework
- Four-step guide: Pick Your Platform, Block the Time, Structure the Journey, Celebrate the Learning
- Downloads subsection (currently placeholder, to be populated post-event)

### Footer
- Seven2 x Loveable full logo lockup with split clickable regions (same as nav)
- "A Murtopolis Venture" tagline
- Links to seven2.com, lovable.dev, murtopolis.com
- Copyright

---

## 6. Technical Architecture

### Tech Stack
- **Build tool:** Vite + vanilla TypeScript (no React, no frameworks)
- **Styling:** Pure CSS with custom properties, no preprocessors, no CSS frameworks
- **Data layer:** @supabase/supabase-js client connecting to two Supabase instances
- **Fonts:** Google Fonts -- EB Garamond (serif), Inter (sans-serif), JetBrains Mono (monospace)
- **Hosting:** Vercel with auto-deploy from `main` branch on GitHub
- **Domain:** hacks.murtopolis.com (CNAME to cname.vercel-dns.com)

### Dual Supabase Architecture

The site reads from two completely separate Supabase projects:

**IdeaLab Supabase** (project ID: `pplbzzrbyrkqajkiuzfx`)
- An existing Loveable-built application at idealab.seven2.com
- Used by Seven2 employees to submit and manage project ideas
- Protected by Google OAuth (Seven2 employees only)
- This site reads from it with a public SELECT policy on the `ideas` table
- Filtered by `organization_id = '16a200e8-7125-47f3-b694-063f5bf53479'` (Seven2 org)
- Also has external users from a public-facing version of IdeaLab -- the org filter ensures only Seven2 ideas appear on the Hacks-a-Thon site

**Hacksathon Supabase** (project ID: `rzbmylyeacmjkipmpmwh`)
- A dedicated project for event-specific data, voting, and reflections
- Core tables (`blocks`, `awards`, `downloadable_assets`) have public read-only RLS policies
- `votes` and `reflections` have public read + insert + update policies for ballot/form submissions
- `voting_config` has no public policies -- accessible only via SECURITY DEFINER RPC functions
- Admin operations (toggle voting, announce winners, feature reflections, manage passcodes) are all handled through RPCs gated by the admin passcode

### Environment Variables
```
VITE_IDEALAB_SUPABASE_URL=https://pplbzzrbyrkqajkiuzfx.supabase.co
VITE_IDEALAB_SUPABASE_ANON_KEY=[jwt-token]
VITE_HACKSATHON_SUPABASE_URL=https://rzbmylyeacmjkipmpmwh.supabase.co
VITE_HACKSATHON_SUPABASE_ANON_KEY=[jwt-token]
```

Stored in `.env.local` locally and in Vercel's Environment Variables for production. Vite bakes these into the build at compile time (prefixed with `VITE_`).

---

## 7. Data Schemas

### IdeaLab: `ideas` table (read-only from this site)

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| title | text | Project title |
| pitch | text | Short elevator pitch |
| description | text (nullable) | Full project description |
| submitter | text | Person's display name |
| sparks | integer | Like count (not used on Hacks-a-Thon site) |
| status | enum | `idea_stage`, `in_progress`, `completed` |
| project_url | text (nullable) | Live project URL |
| organization_id | uuid | FK to organizations -- filtered to Seven2 org |
| created_at | timestamptz | |
| updated_at | timestamptz | |

Other IdeaLab tables (not used by this site): `profiles`, `idea_comments`, `idea_sparks`, `ai_generated_ideas`, `organizations`, `user_roles`

### Hacksathon: `blocks` table

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| block_key | text | Unique: `zero`, `1`, `2`, `3`, `4a`, `4b`, `4c`, `final` |
| title | text | Block title |
| subtitle | text (nullable) | Optional subtitle |
| duration_minutes | integer | Session length |
| description | text (nullable) | What happens in this block |
| purpose | text (nullable) | Why this block exists |
| status | text | `upcoming`, `active`, `completed` |
| scheduled_date | timestamptz (nullable) | When scheduled |
| sort_order | integer | Display order (0-7) |
| created_at | timestamptz | |

### Hacksathon: `awards` table

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| category | text | Unique award name |
| description | text (nullable) | What the award recognizes |
| winner_name | text (nullable) | Populated post-event |
| project_title | text (nullable) | Winner's project name |
| project_url | text (nullable) | Link to winner's project |
| created_at | timestamptz | |

### Hacksathon: `reflections` table

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| participant_name | text | Who said it |
| question | text | Which reflection question |
| answer | text | Their response |
| is_featured | boolean | Set to `true` to display on site |
| created_at | timestamptz | |

### Hacksathon: `downloadable_assets` table

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| title | text | Asset name |
| description | text (nullable) | What it is |
| file_url | text | Download URL |
| file_type | text | Default: `pdf` |
| sort_order | integer | Display order |
| created_at | timestamptz | |

### Hacksathon: `voting_config` table (singleton)

| Column | Type | Notes |
|---|---|---|
| id | integer | Always 1 (CHECK constraint) |
| voting_open | boolean | Whether the ballot is accepting votes |
| vote_passcode | text | Passcode for `/vote` (default: `seven2hacks`) |
| admin_passcode | text | Passcode for `/admin` (default: `hackyadmin`) |
| reflect_passcode | text | Passcode for `/reflect` (default: `seven2reflect`) |
| voting_deadline | text (nullable) | Freeform deadline text shown to voters |
| updated_at | timestamptz | |

No public RLS policies — accessible only via SECURITY DEFINER RPC functions.

### Hacksathon: `votes` table

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| voter_name | text | Who voted |
| category | text | Which award category |
| project_title | text | The project they picked |
| project_id | text (nullable) | IdeaLab project ID |
| created_at | timestamptz | |

Unique constraint on `(voter_name, category)` — one pick per person per category, with upsert support.

### Hacksathon: `excluded_projects` table

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| project_id | text | IdeaLab project ID (unique) |
| project_title | text | Display name |
| created_at | timestamptz | |

### Hacksathon: RPC Functions (SECURITY DEFINER)

All sensitive operations run through server-side functions so passcodes are never exposed to the client:

| Function | Purpose |
|---|---|
| `verify_vote_passcode(code)` | Returns `{ valid, voting_open, deadline }` |
| `verify_admin_passcode(code)` | Returns boolean |
| `verify_reflect_passcode(code)` | Returns `{ valid }` |
| `get_voting_config(admin_code)` | Returns all config values including passcodes (admin-gated) |
| `toggle_voting(admin_code, is_open)` | Open/close voting |
| `set_voting_deadline(admin_code, deadline)` | Set deadline text |
| `update_vote_passcode(admin_code, new_passcode)` | Change vote passcode |
| `update_admin_passcode(admin_code, new_passcode)` | Change admin passcode |
| `update_reflect_passcode(admin_code, new_passcode)` | Change reflect passcode |
| `toggle_exclusion(admin_code, project_id, title, exclude)` | Mark project eligible/ineligible |
| `announce_winner(admin_code, category, winner, project, url)` | Write winner to awards table |
| `toggle_featured(admin_code, reflection_id, featured)` | Feature/unfeature a reflection answer |

---

## 8. Design Decisions

### Why Vignelli Canon

Nick recently purchased *The Vignelli Canon* by Massimo Vignelli and wanted the site to reflect its mid-century modernist design principles. This influenced every visual decision:

- **Grid system:** Strict 12-column modular grid with 8px base spacing unit. Every element aligns to the grid. Whitespace is intentional, not leftover.
- **Typography:** Limited to three typefaces (Vignelli advocated using very few). EB Garamond for serif headings (editorial authority), Inter for sans-serif body (clean legibility), JetBrains Mono for labels and numbers (code-like precision).
- **Color:** Minimal. Black (#1A1A1A), grays, and white. No gratuitous color. The Loveable gradient (orange-red-pink-blue) is defined in tokens but used sparingly.
- **Layout:** Content-driven, not decoration-driven. Large type, strong alignment, clear hierarchy. Every element earns its place.

### Why Not Murtopolis Design System

Originally planned to use the Murtopolis warm editorial palette (tans, browns, serif-heavy). This was deliberately dropped in favor of the Vignelli approach with a clean white background -- better alignment with both Seven2 and Loveable's brands, and creates a more neutral, professional case study feel.

### Why Vanilla TypeScript (No Framework)

- Keeps the handcrafted feel consistent with how the main Murtopolis site is built (single HTML file)
- The site is primarily static content with small dynamic islands (project cards, awards, reflections)
- No need for a full SPA framework -- vanilla TS + Supabase client handles everything
- Faster build times, smaller bundle, simpler mental model

---

## 9. Current State

### Marketing Site (`/`)
- Full single-page site with all 8 sections
- Sticky navigation with logo lockup and anchor links
- All 8 blocks with expandable checklists
- Live project cards from IdeaLab (filtered to Seven2 org)
- Click-to-open project detail modal
- Award categories displayed with "Vote for the Hackies" CTA
- Reflection questions listed with "Share Your Reflections" CTA
- Featured reflections rendered from Supabase when toggled by admin
- "Run Your Own" framework section
- Responsive design (mobile hamburger nav, stacked grids)
- Scroll-triggered fade-in animations
- OG image for social sharing (1200x630 PNG)
- Auto-deploy from GitHub main branch to Vercel
- Custom domain: hacks.murtopolis.com

### Voting System (`/vote`)
- Passcode-gated ballot with voter name (stored in localStorage)
- Respects voting open/closed state and deadline from admin settings
- Displays all IdeaLab projects minus excluded ones
- Pick one project per category across 6 award categories
- Upsert support — voters can change their picks before voting closes
- Voting is completely blind; no results visible to voters

### Admin Dashboard (`/admin`)
- Passcode-gated admin access
- Voting settings: open/close voting, set deadline, manage all three passcodes
- Project eligibility: toggle IdeaLab projects on/off the ballot
- Voter roll call: see who has voted and their completion status
- Reflections admin: view all submissions grouped by participant, toggle featured
- Results by category: tallied votes with percentages, individual voter names
- Announce winners: one-click to write winner to awards table (updates main site instantly)

### Reflections Form (`/reflect`)
- Passcode-gated 7-question form with participant name
- Pre-populates existing answers if participant has already submitted
- Upsert support — participants can edit and resubmit anytime
- Confirmation screen with summary and edit option

### What's Placeholder / Empty
- Downloadable assets (created post-event)
- Downloads section says "coming soon after the event wraps"

---

## 10. Post-Event Workflow

Most post-event updates are done through the admin dashboard at `/admin` — no code changes or direct database access needed.

### Update Block Statuses
In the Supabase dashboard, change `status` from `upcoming` to `completed` for each finished block. Set the current block to `active` during the event.

### Run the Hacky Awards Vote
1. Open voting from `/admin` settings
2. Share the vote passcode and `hacks.murtopolis.com/vote` with the team
3. Optionally set a deadline string
4. Monitor voter participation and results in real-time from `/admin`
5. Close voting when ready

### Announce Award Winners
From the `/admin` dashboard "Announce Winners" section:
- Review vote tallies per category
- Click "Announce Winner" for each category — writes directly to the `awards` table
- The main site updates immediately with the winner's name, project, and link

### Collect and Feature Reflections
1. Share the reflect passcode and `hacks.murtopolis.com/reflect` with the team
2. Participants submit answers to 7 reflection questions
3. In `/admin`, expand each participant's submissions
4. Toggle standout answers as "featured" — they appear on the main site instantly

### Add Downloadable Assets
Insert rows into the `downloadable_assets` table via Supabase dashboard:
- `title` -- e.g., "The Playbook PDF"
- `description` -- what it contains
- `file_url` -- URL to the hosted file
- `sort_order` -- display order

Planned downloads: Playbook PDF, Checklist Template, Reflection Questions Sheet, Case Study Summary.

---

## 11. Pending Items

### PostHog Analytics
Not yet implemented. Should add PostHog tracking (same setup as main Murtopolis site). Low priority -- implement before the event goes fully public as a case study. Will need the PostHog API key and host configuration added to the HTML.

### Downloadable PDFs
Need to be designed and created after the event. Should match the Vignelli aesthetic of the site. Formats: Playbook, Checklist, Reflection Questions, Case Study Summary.

---

## 12. Connected Systems

| System | URL | What It Does | Connection |
|---|---|---|---|
| Hacks-a-Thon Site | hacks.murtopolis.com | Public event site + case study | This project |
| IdeaLab | idealab.seven2.com | Idea submission + management for Seven2 | Read-only via Supabase anon key |
| Murtopolis | murtopolis.com | Nick's portfolio/ventures site | Parent brand, Vercel org |
| Seven2 | seven2.com | Agency website | Co-brand partner |
| Loveable | lovable.dev | AI app builder platform | Co-brand partner, build tool |
| GitHub | github.com/murtopia/hacks-a-thon | Source code | Auto-deploy to Vercel |
| Vercel | vercel.com | Hosting + CDN | Deploys from GitHub |
| Supabase (IdeaLab) | pplbzzrbyrkqajkiuzfx.supabase.co | IdeaLab database | Read project data |
| Supabase (Hacksathon) | rzbmylyeacmjkipmpmwh.supabase.co | Event database | Read blocks, awards, reflections |
| Slack | #hacks-a-thon channel | Team communication during event | Not integrated, referenced in playbook |

---

## 13. File Structure Reference

```
hacksathon-site/
├── index.html                    # Marketing site with all public sections
├── vote.html                     # Hacky Awards ballot (noindex)
├── admin.html                    # Admin dashboard (noindex)
├── reflect.html                  # Reflection form (noindex)
├── PLANNING.md                   # This document
├── README.md                     # Developer/operator reference
├── package.json                  # Dependencies: vite, typescript, @supabase/supabase-js
├── vite.config.ts                # Multi-page build config (4 HTML inputs), dev server port 3000
├── tsconfig.json                 # TypeScript config
├── vercel.json                   # Vercel config: rewrites for /vote, /admin, /reflect
├── .env.local                    # Local environment variables (git-ignored)
├── .gitignore                    # Ignores node_modules, dist, *.local
├── public/
│   ├── favicon.svg               # Black square with white "H"
│   ├── og-image.png              # 1200x630 social sharing image
│   ├── og-image.svg              # SVG source of OG image
│   ├── s2-lovable-lockup.png     # Full logo lockup (transparent PNG, 2140x306)
│   └── s2-lovable-icons.png      # Icons-only lockup (Seven2 flags + Loveable heart)
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
│   │   ├── projects.ts           # Fetches IdeaLab ideas, renders cards + modal
│   │   ├── awards.ts             # Fetches awards, populates winner slots
│   │   └── reflections.ts        # Fetches featured reflections, renders quotes
│   ├── vote/
│   │   └── ballot.ts             # Passcode gate, project selection, vote submission
│   ├── admin/
│   │   └── dashboard.ts          # Settings, eligibility, voters, results, announce, reflections
│   ├── reflect/
│   │   └── form.ts               # Passcode gate, 7-question form, upsert, confirmation
│   ├── supabase/
│   │   ├── idealab-client.ts     # createClient for IdeaLab Supabase
│   │   ├── hacksathon-client.ts  # createClient for Hacksathon Supabase (nullable)
│   │   ├── queries.ts            # Typed fetch functions for IdeaLab ideas, awards, reflections
│   │   └── vote-queries.ts       # All voting, admin, and reflection RPC calls
│   ├── styles/
│   │   ├── tokens.css            # CSS custom properties: colors, spacing, type scale, transitions
│   │   ├── base.css              # Reset, body defaults, selection, scroll-padding
│   │   ├── grid.css              # 12-column grid, container, column spans
│   │   ├── typography.css        # h1-h4 styles, .mono-label, .lead, .subsection-title
│   │   ├── components.css        # Role cards, block cards, project cards, award cards,
│   │   │                         # reflection prompts, modal, run-your-own steps
│   │   ├── sections.css          # Nav, hero, generic section, footer, lockup links
│   │   ├── animations.css        # .fade-in with IntersectionObserver, stagger delays
│   │   ├── vote.css              # Vote ballot + "Vote for the Hackies" CTA on main site
│   │   ├── admin.css             # Admin dashboard styles
│   │   └── reflect.css           # Reflect form + "Share Your Reflections" CTA on main site
│   └── utils/
│       ├── scroll.ts             # IntersectionObserver for fade-in animations
│       ├── expand.ts             # Checklist toggle (aria-expanded + hidden)
│       └── nav.ts                # Mobile menu toggle, active section highlighting
└── supabase/
    ├── migration.sql             # Base schema + seed data for Hacksathon Supabase
    ├── voting-migration.sql      # Voting system: tables, RLS, RPCs (apply after migration.sql)
    └── reflections-migration.sql # Reflections system: column, constraint, RLS, RPCs (apply last)
```

---

## 14. Growth Opportunities

### What Was Built (beyond the original scope)

These started as future ideas and were implemented during the project:

- **Hacky Awards voting system** — Full blind ballot at `/vote` with passcode gate, category-based voting, upsert support, and voting open/close controls
- **Admin dashboard** — `/admin` with passcode gate, voting settings, project eligibility toggles, voter roll call, results tallies, winner announcement, and reflection management
- **Reflections form** — `/reflect` with passcode gate, 7-question form, upsert support, and featured toggle from admin
- **Multi-page architecture** — Vite multi-page build with Vercel rewrites for clean URLs

### Future Ideas

These are natural extensions for building on top of what exists. None are committed -- they're starting points for future planning.

#### During-Event Enhancements
- **Live block progress indicator:** Update block statuses in Supabase as the event progresses; the timeline visually reflects which phase is active/completed
- **Slack integration:** Bot that posts to #hacks-a-thon when a new idea is submitted to IdeaLab or a project URL is added
- **Countdown timer:** Show time remaining until the next block or the Showcase Showdown

#### Post-Event Case Study
- **Photo/video gallery:** Embed screenshots, demo recordings, or photos from the event
- **Metrics dashboard:** Participation rate, number of live demos, AI tool usage stats, comfort-level growth
- **LinkedIn case study generator:** Auto-format the best reflections and outcomes into a shareable post

#### Expanding to Other Companies
- **White-label template:** Make the playbook and site structure available as a template other companies can fork and customize
- **Parameterized setup:** Accept company name, brand colors, event dates, and platform choice as configuration rather than hardcoded content
- **Hosted SaaS version:** A platform where any company can spin up their own Hacks-a-Thon instance with their branding

#### IdeaLab Integration Deepening
- **Bi-directional sync:** Allow the Hacks-a-Thon site to write back to IdeaLab (e.g., marking ideas as Hacks-a-Thon entries)
- **Progress timeline per project:** Show a history of status changes (ideating -> building -> complete) with timestamps

#### Repeat Events
- **Multi-event support:** If Seven2 runs this again, support multiple Hacks-a-Thons on the same site (archived past events, current event)
- **Leaderboard across events:** Track who's participated, built the most, won awards across multiple Hacks-a-Thons
- **Alumni showcase:** A permanent gallery of all projects ever built across all events

#### Content and Documentation
- **Downloadable playbook PDF:** Professionally designed, matching the Vignelli aesthetic
- **Video walkthrough:** A recorded tour of the site and how to use it
- **Book chapter material:** Nick mentioned potential book content -- the reflections and outcomes feed directly into this

#### Technical Improvements
- **PostHog analytics:** Track pageviews, section engagement, modal opens, outbound clicks to project URLs
- **Image optimization:** Convert PNGs to WebP with fallbacks for smaller file sizes
- **RSS feed or changelog:** For companies following the Hacks-a-Thon format, a feed of updates and new resources
- **Block status management in admin:** Add block status updates to the admin dashboard instead of requiring Supabase dashboard access

---

## 15. Slack Channel Norms (from playbook)

The #hacks-a-thon Slack channel is encouraged for:
- Screenshots
- Progress links
- Questions
- "Look what I just got working" moments
- Breakthrough moments

After each build block, participants drop their current Loveable link or screenshot.

### Office Hours Structure
- During build blocks: Open Zoom room, drop-in format
- Between blocks: Optional 1:1 time slots available
- Guideline: If stuck for more than 15 minutes, reach out or come to office hours

---

## 16. Success Metrics (from playbook)

**Success is:**
- 100% participation
- 100% live demos
- Increased confidence
- AI comfort growth / increased AI literacy
- Momentum toward future builds

**Success is not:**
- Perfection
- Production-ready apps
- Technical complexity

---

## 17. Post-Event Review Checklist (from playbook)

After the Showcase:
- Identify strongest projects
- Identify strongest quotes
- Capture learning themes
- Outline LinkedIn case study
- Identify book chapter takeaways
- Gather feedback for future Hacks-a-Thons
