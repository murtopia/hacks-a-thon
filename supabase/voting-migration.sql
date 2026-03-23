-- ============================================
-- Hacky Awards Voting System
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rzbmylyeacmjkipmpmwh/sql
-- ============================================

-- 1. Update award categories
DELETE FROM awards;

INSERT INTO awards (category, description) VALUES
  ('Best in Show', 'The overall standout'),
  ('Shut Up and Take My Money', 'The one everyone actually wants to use'),
  ('Best Execution', 'Cleanest build quality and implementation'),
  ('Most Creative Idea', 'The idea that surprised everyone'),
  ('Best Shark Tank Pitch', 'Best presentation and storytelling during demos'),
  ('Most Seven2 Energy', 'Creative, bold, and fun — pure Seven2 spirit');

-- 2. Voting config (singleton row)
CREATE TABLE voting_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  voting_open BOOLEAN NOT NULL DEFAULT false,
  vote_passcode TEXT NOT NULL DEFAULT 'seven2hacks',
  admin_passcode TEXT NOT NULL DEFAULT 'hackyadmin',
  voting_deadline TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO voting_config (id) VALUES (1);

-- 3. Excluded projects (ineligible for voting)
CREATE TABLE excluded_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL UNIQUE,
  project_title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Votes
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voter_name TEXT NOT NULL,
  category TEXT NOT NULL,
  project_title TEXT NOT NULL,
  project_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(voter_name, category)
);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE voting_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE excluded_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- voting_config: NO public access (only via RPC)
-- (no policies = no access through standard queries)

-- excluded_projects: public read, no public write
CREATE POLICY "Public read excluded_projects" ON excluded_projects
  FOR SELECT USING (true);

-- votes: public read + insert + update (for upsert)
CREATE POLICY "Public read votes" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Public insert votes" ON votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update votes" ON votes
  FOR UPDATE USING (true);

-- ============================================
-- RPC Functions (SECURITY DEFINER)
-- Passcodes never exposed to the client
-- ============================================

CREATE OR REPLACE FUNCTION verify_vote_passcode(code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cfg voting_config%ROWTYPE;
BEGIN
  SELECT * INTO cfg FROM voting_config WHERE id = 1;
  IF cfg IS NULL THEN
    RETURN json_build_object('valid', false, 'voting_open', false, 'deadline', null);
  END IF;
  IF NOT cfg.voting_open THEN
    RETURN json_build_object('valid', false, 'voting_open', false, 'deadline', cfg.voting_deadline);
  END IF;
  IF cfg.vote_passcode != code THEN
    RETURN json_build_object('valid', false, 'voting_open', true, 'deadline', cfg.voting_deadline);
  END IF;
  RETURN json_build_object('valid', true, 'voting_open', true, 'deadline', cfg.voting_deadline);
END;
$$;

CREATE OR REPLACE FUNCTION verify_admin_passcode(code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cfg voting_config%ROWTYPE;
BEGIN
  SELECT * INTO cfg FROM voting_config WHERE id = 1;
  IF cfg IS NULL OR cfg.admin_passcode != code THEN
    RETURN false;
  END IF;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION get_voting_config(admin_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cfg voting_config%ROWTYPE;
BEGIN
  SELECT * INTO cfg FROM voting_config WHERE id = 1;
  IF cfg IS NULL OR cfg.admin_passcode != admin_code THEN
    RETURN json_build_object('valid', false);
  END IF;
  RETURN json_build_object(
    'valid', true,
    'voting_open', cfg.voting_open,
    'vote_passcode', cfg.vote_passcode,
    'voting_deadline', cfg.voting_deadline
  );
END;
$$;

CREATE OR REPLACE FUNCTION toggle_voting(admin_code TEXT, is_open BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cfg voting_config%ROWTYPE;
BEGIN
  SELECT * INTO cfg FROM voting_config WHERE id = 1;
  IF cfg IS NULL OR cfg.admin_passcode != admin_code THEN
    RETURN false;
  END IF;
  UPDATE voting_config SET voting_open = is_open, updated_at = now() WHERE id = 1;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION set_voting_deadline(admin_code TEXT, deadline TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cfg voting_config%ROWTYPE;
BEGIN
  SELECT * INTO cfg FROM voting_config WHERE id = 1;
  IF cfg IS NULL OR cfg.admin_passcode != admin_code THEN
    RETURN false;
  END IF;
  UPDATE voting_config SET voting_deadline = deadline, updated_at = now() WHERE id = 1;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION update_vote_passcode(admin_code TEXT, new_passcode TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cfg voting_config%ROWTYPE;
BEGIN
  SELECT * INTO cfg FROM voting_config WHERE id = 1;
  IF cfg IS NULL OR cfg.admin_passcode != admin_code THEN
    RETURN false;
  END IF;
  UPDATE voting_config SET vote_passcode = new_passcode, updated_at = now() WHERE id = 1;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION update_admin_passcode(admin_code TEXT, new_passcode TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cfg voting_config%ROWTYPE;
BEGIN
  SELECT * INTO cfg FROM voting_config WHERE id = 1;
  IF cfg IS NULL OR cfg.admin_passcode != admin_code THEN
    RETURN false;
  END IF;
  UPDATE voting_config SET admin_passcode = new_passcode, updated_at = now() WHERE id = 1;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION toggle_exclusion(
  admin_code TEXT,
  p_project_id TEXT,
  p_project_title TEXT,
  p_exclude BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cfg voting_config%ROWTYPE;
BEGIN
  SELECT * INTO cfg FROM voting_config WHERE id = 1;
  IF cfg IS NULL OR cfg.admin_passcode != admin_code THEN
    RETURN false;
  END IF;
  IF p_exclude THEN
    INSERT INTO excluded_projects (project_id, project_title)
    VALUES (p_project_id, p_project_title)
    ON CONFLICT (project_id) DO NOTHING;
  ELSE
    DELETE FROM excluded_projects WHERE project_id = p_project_id;
  END IF;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION announce_winner(
  admin_code TEXT,
  category_name TEXT,
  winner TEXT,
  project TEXT,
  url TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cfg voting_config%ROWTYPE;
BEGIN
  SELECT * INTO cfg FROM voting_config WHERE id = 1;
  IF cfg IS NULL OR cfg.admin_passcode != admin_code THEN
    RETURN false;
  END IF;
  UPDATE awards
  SET winner_name = winner,
      project_title = project,
      project_url = url
  WHERE category = category_name;
  RETURN FOUND;
END;
$$;
