/*
# Create Avinex AI tables: ai_memory, reviews_feedback, pro_upgrades, ai_conversations

1. New Tables
- `ai_memory`: Stores user preferences for Avinex AI (language, style, goals, nickname) with consent.
  - id (uuid, PK)
  - user_id (uuid, NOT NULL, DEFAULT auth.uid(), references auth.users)
  - preferred_language (text, nullable)
  - preferred_style (text, nullable) — Friendly, Teacher, Professional, Motivational, Calm, Funny, Strict Mentor, Exam Coach
  - study_goals (text, nullable)
  - favourite_subjects (text, nullable)
  - nickname (text, nullable)
  - memory_enabled (boolean, DEFAULT false)
  - created_at (timestptz, DEFAULT now())
  - updated_at (timestamptz, DEFAULT now())

- `reviews_feedback`: Stores user reviews, bug reports, feature requests, AI mistake reports.
  - id (uuid, PK)
  - user_id (uuid, NOT NULL, DEFAULT auth.uid(), references auth.users)
  - type (text, NOT NULL) — 'rating', 'bug', 'feature_request', 'ai_mistake', 'improvement'
  - rating (integer, nullable, 1-5)
  - message (text, NOT NULL)
  - screenshot_url (text, nullable)
  - status (text, DEFAULT 'open') — 'open', 'reviewed', 'resolved'
  - created_at (timestamptz, DEFAULT now())

- `pro_upgrades`: Tracks Pro status for Avinex AI Pro (₹30 one-time).
  - id (uuid, PK)
  - user_id (uuid, NOT NULL, DEFAULT auth.uid(), references auth.users)
  - is_pro (boolean, DEFAULT false)
  - payment_id (text, nullable)
  - amount (integer, DEFAULT 30)
  - upgraded_at (timestamptz, nullable)
  - created_at (timestamptz, DEFAULT now())

- `ai_conversations`: Stores Avinex AI chat messages.
  - id (uuid, PK)
  - user_id (uuid, NOT NULL, DEFAULT auth.uid(), references auth.users)
  - mode (text, NOT NULL) — 'academic' or 'companion'
  - role (text, NOT NULL) — 'user' or 'assistant'
  - content (text, NOT NULL)
  - image_url (text, nullable)
  - language (text, nullable)
  - created_at (timestamptz, DEFAULT now())

2. Security
- RLS enabled on all tables.
- Owner-scoped CRUD: each authenticated user can only access their own rows.
- user_id defaults to auth.uid() so inserts without explicit user_id succeed.
*/

-- ai_memory
CREATE TABLE IF NOT EXISTS ai_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_language text,
  preferred_style text,
  study_goals text,
  favourite_subjects text,
  nickname text,
  memory_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_memory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_ai_memory" ON ai_memory;
CREATE POLICY "select_own_ai_memory" ON ai_memory FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_ai_memory" ON ai_memory;
CREATE POLICY "insert_own_ai_memory" ON ai_memory FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_ai_memory" ON ai_memory;
CREATE POLICY "update_own_ai_memory" ON ai_memory FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_ai_memory" ON ai_memory;
CREATE POLICY "delete_own_ai_memory" ON ai_memory FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- reviews_feedback
CREATE TABLE IF NOT EXISTS reviews_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  rating integer,
  message text NOT NULL,
  screenshot_url text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reviews" ON reviews_feedback;
CREATE POLICY "select_own_reviews" ON reviews_feedback FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reviews" ON reviews_feedback;
CREATE POLICY "insert_own_reviews" ON reviews_feedback FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reviews" ON reviews_feedback;
CREATE POLICY "update_own_reviews" ON reviews_feedback FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reviews" ON reviews_feedback;
CREATE POLICY "delete_own_reviews" ON reviews_feedback FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- pro_upgrades
CREATE TABLE IF NOT EXISTS pro_upgrades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  is_pro boolean NOT NULL DEFAULT false,
  payment_id text,
  amount integer NOT NULL DEFAULT 30,
  upgraded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pro_upgrades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_pro" ON pro_upgrades;
CREATE POLICY "select_own_pro" ON pro_upgrades FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_pro" ON pro_upgrades;
CREATE POLICY "insert_own_pro" ON pro_upgrades FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_pro" ON pro_upgrades;
CREATE POLICY "update_own_pro" ON pro_upgrades FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_pro" ON pro_upgrades;
CREATE POLICY "delete_own_pro" ON pro_upgrades FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ai_conversations
CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  mode text NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  image_url text,
  language text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_conversations" ON ai_conversations;
CREATE POLICY "select_own_conversations" ON ai_conversations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_conversations" ON ai_conversations;
CREATE POLICY "insert_own_conversations" ON ai_conversations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_conversations" ON ai_conversations;
CREATE POLICY "delete_own_conversations" ON ai_conversations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_memory_user_id ON ai_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_feedback_user_id ON reviews_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_pro_upgrades_user_id ON pro_upgrades(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
