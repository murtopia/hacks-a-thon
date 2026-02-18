-- ============================================
-- Hacksathon Supabase Schema
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rzbmylyeacmjkipmpmwh/sql
-- ============================================

-- Blocks: the event phases/timeline
CREATE TABLE blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  duration_minutes INTEGER NOT NULL,
  description TEXT,
  purpose TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  scheduled_date TIMESTAMPTZ,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Awards: The Hacky Awards
CREATE TABLE awards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  description TEXT,
  winner_name TEXT,
  project_title TEXT,
  project_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reflections: participant responses to reflection questions
CREATE TABLE reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_name TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Downloadable assets: PDFs, templates, etc.
CREATE TABLE downloadable_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row Level Security: public read, no anonymous writes
-- ============================================

ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloadable_assets ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (the site is a public showcase)
CREATE POLICY "Public read access" ON blocks
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON awards
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON reflections
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON downloadable_assets
  FOR SELECT USING (true);

-- ============================================
-- Seed data: blocks from the playbook
-- ============================================

INSERT INTO blocks (block_key, title, subtitle, duration_minutes, description, purpose, status, sort_order) VALUES
  ('zero', 'Kickoff', NULL, 15,
   'Introduce Loveable, explain vibe coding, set expectations, and outline the structure. Encourage the use of AI to help you work with AI.',
   'Remove intimidation and create clarity before ideas begin.',
   'upcoming', 0),

  ('1', 'Sprint to the IdeaLab', NULL, 30,
   'Your chance to brainstorm, define and submit your project idea at IdeaLab.seven2.com',
   'Commit to a direction and articulate why the idea matters to you.',
   'upcoming', 1),

  ('2', 'Shark Tank, Minus the Sharks', NULL, 45,
   'Each participant delivers a 1-minute pitch with light feedback from the team.',
   'Sharpen ideas and build collective energy.',
   'upcoming', 2),

  ('3', 'Documentation Is Everything', NULL, 30,
   'Develop specifics around your idea using AI, ZERO.Prmptr.ai, IdeaLab, or all three.',
   'Translate the idea into a low-prompt, buildable direction.',
   'upcoming', 3),

  ('4a', 'Here We Go!', 'Build Session 1', 45,
   'It''s time to start your project in Loveable!',
   'Jumpstart development of your idea.',
   'upcoming', 4),

  ('4b', 'Build Session 2', NULL, 45,
   'Protected build time with optional office hours.',
   'Iterate and improve.',
   'upcoming', 5),

  ('4c', 'Your Final Build Session', NULL, 45,
   'This is your last time-blocked build session. However, you are free to work on it further in your free time.',
   'Polish demo flow and prepare for showcase.',
   'upcoming', 6),

  ('final', 'Showcase Showdown', NULL, 120,
   'Each participant presents a 3-minute (or less) demo followed by 2-minute Q&A from the team.',
   'Celebrate learning, reflect on insights, and capture takeaways.',
   'upcoming', 7);

-- ============================================
-- Seed data: award categories
-- ============================================

INSERT INTO awards (category, description) VALUES
  ('Most Creative Idea', 'The idea that made everyone say "why didn''t I think of that?"'),
  ('Best Use of AI', 'Leveraged AI tools most effectively throughout the build process'),
  ('Most Unexpected Build', 'The project nobody saw coming'),
  ('Best Execution', 'Cleanest implementation and demo polish'),
  ('People''s Choice', 'Voted favorite by the team'),
  ('Most Seven2 Energy', 'Embodies the Seven2 spirit — creative, bold, and fun');
