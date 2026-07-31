/*
# Create Science PYQ AI application schema

## Overview
Multi-user schema for a CBSE Class 10 Science learning platform with auth.
Each user owns their bookmarks, practice attempts, mock test results, study plans, doubt history, and revision progress.

## New Tables
1. `profiles` — user display name and avatar (1:1 with auth.users)
2. `bookmarks` — saved questions, notes, flashcards, topics
3. `practice_attempts` — records of AI practice question sessions
4. `mock_test_results` — results of completed mock tests
5. `study_plans` — generated study schedules
6. `doubt_history` — chat history for the AI doubt solver
7. `revision_progress` — per-chapter revision tracking

## Security
- RLS enabled on all tables.
- Owner-scoped CRUD: each authenticated user can only access their own rows.
- All user_id columns default to auth.uid() so inserts that omit user_id succeed.
*/

-- 1. profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  target_percentage int DEFAULT 90,
  exam_date date,
  daily_study_hours numeric DEFAULT 2,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 2. bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'question' CHECK (type IN ('question','note','flashcard','topic')),
  title text NOT NULL,
  content text,
  chapter text,
  subject text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookmarks" ON bookmarks;
CREATE POLICY "select_own_bookmarks" ON bookmarks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookmarks" ON bookmarks;
CREATE POLICY "insert_own_bookmarks" ON bookmarks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookmarks" ON bookmarks;
CREATE POLICY "update_own_bookmarks" ON bookmarks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookmarks" ON bookmarks;
CREATE POLICY "delete_own_bookmarks" ON bookmarks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);

-- 3. practice_attempts
CREATE TABLE IF NOT EXISTS practice_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter text NOT NULL,
  question_count int NOT NULL DEFAULT 10,
  difficulty text DEFAULT 'Mixed',
  score int,
  total int,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE practice_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_practice" ON practice_attempts;
CREATE POLICY "select_own_practice" ON practice_attempts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_practice" ON practice_attempts;
CREATE POLICY "insert_own_practice" ON practice_attempts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_practice" ON practice_attempts;
CREATE POLICY "update_own_practice" ON practice_attempts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_practice" ON practice_attempts;
CREATE POLICY "delete_own_practice" ON practice_attempts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_practice_user ON practice_attempts(user_id);

-- 4. mock_test_results
CREATE TABLE IF NOT EXISTS mock_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  test_type text NOT NULL DEFAULT 'chapter',
  chapters text[],
  question_count int NOT NULL DEFAULT 10,
  difficulty text DEFAULT 'Mixed',
  score int NOT NULL DEFAULT 0,
  total int NOT NULL DEFAULT 10,
  time_taken_seconds int,
  predicted_score int,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mock_test_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_mock_tests" ON mock_test_results;
CREATE POLICY "select_own_mock_tests" ON mock_test_results FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_mock_tests" ON mock_test_results;
CREATE POLICY "insert_own_mock_tests" ON mock_test_results FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_mock_tests" ON mock_test_results;
CREATE POLICY "update_own_mock_tests" ON mock_test_results FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_mock_tests" ON mock_test_results;
CREATE POLICY "delete_own_mock_tests" ON mock_test_results FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_mock_tests_user ON mock_test_results(user_id);

-- 5. study_plans
CREATE TABLE IF NOT EXISTS study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_date date NOT NULL,
  daily_hours numeric NOT NULL DEFAULT 2,
  target_percentage int DEFAULT 90,
  completed_chapters text[] DEFAULT '{}',
  plan_data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_study_plans" ON study_plans;
CREATE POLICY "select_own_study_plans" ON study_plans FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_study_plans" ON study_plans;
CREATE POLICY "insert_own_study_plans" ON study_plans FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_study_plans" ON study_plans;
CREATE POLICY "update_own_study_plans" ON study_plans FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_study_plans" ON study_plans;
CREATE POLICY "delete_own_study_plans" ON study_plans FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_study_plans_user ON study_plans(user_id);

-- 6. doubt_history
CREATE TABLE IF NOT EXISTS doubt_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  chapter text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE doubt_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_doubts" ON doubt_history;
CREATE POLICY "select_own_doubts" ON doubt_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_doubts" ON doubt_history;
CREATE POLICY "insert_own_doubts" ON doubt_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_doubts" ON doubt_history;
CREATE POLICY "delete_own_doubts" ON doubt_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_doubts_user ON doubt_history(user_id);

-- 7. revision_progress
CREATE TABLE IF NOT EXISTS revision_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter text NOT NULL,
  status text NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started','in-progress','completed')),
  last_revised timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, chapter)
);

ALTER TABLE revision_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_revision" ON revision_progress;
CREATE POLICY "select_own_revision" ON revision_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_revision" ON revision_progress;
CREATE POLICY "insert_own_revision" ON revision_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_revision" ON revision_progress;
CREATE POLICY "update_own_revision" ON revision_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_revision" ON revision_progress;
CREATE POLICY "delete_own_revision" ON revision_progress FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_revision_user ON revision_progress(user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();