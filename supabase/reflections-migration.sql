-- ============================================
-- Reflections Form System
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rzbmylyeacmjkipmpmwh/sql
-- ============================================

-- 1. Add reflect_passcode column to voting_config
ALTER TABLE voting_config ADD COLUMN reflect_passcode TEXT NOT NULL DEFAULT 'seven2reflect';

-- 1b. Add unique constraint on reflections for upsert support
ALTER TABLE reflections ADD CONSTRAINT reflections_participant_question_unique
  UNIQUE (participant_name, question);

-- 2. Add INSERT and UPDATE policies on reflections table
CREATE POLICY "Public insert reflections" ON reflections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update reflections" ON reflections
  FOR UPDATE USING (true);

-- 3. RPC: verify reflect passcode
CREATE OR REPLACE FUNCTION verify_reflect_passcode(code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cfg voting_config%ROWTYPE;
BEGIN
  SELECT * INTO cfg FROM voting_config WHERE id = 1;
  IF cfg IS NULL OR cfg.reflect_passcode != code THEN
    RETURN json_build_object('valid', false);
  END IF;
  RETURN json_build_object('valid', true);
END;
$$;

-- 4. RPC: update reflect passcode (admin only)
CREATE OR REPLACE FUNCTION update_reflect_passcode(admin_code TEXT, new_passcode TEXT)
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
  UPDATE voting_config SET reflect_passcode = new_passcode, updated_at = now() WHERE id = 1;
  RETURN true;
END;
$$;

-- 5. RPC: toggle featured (admin only)
CREATE OR REPLACE FUNCTION toggle_featured(admin_code TEXT, reflection_id UUID, featured BOOLEAN)
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
  UPDATE reflections SET is_featured = featured WHERE id = reflection_id;
  RETURN FOUND;
END;
$$;

-- 6. Update get_voting_config to include reflect_passcode
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
    'reflect_passcode', cfg.reflect_passcode,
    'voting_deadline', cfg.voting_deadline
  );
END;
$$;
