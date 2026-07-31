/*
# Create knowledge_base table for Hybrid AI + KB system

1. New Tables
- `knowledge_base`
  - `id` (uuid, primary key)
  - `question` (text, the question or keyword phrase students ask)
  - `answer` (text, the pre-written NCERT-based answer in markdown with LaTeX)
  - `subject` (text: Physics / Chemistry / Biology / General)
  - `chapter` (text, NCERT chapter name)
  - `question_type` (text: Definition / Difference / Numerical / Reason / Law / Formula / Life Process / Chemistry Reaction / Electricity / Magnetism / Human Body / Genetics / PYQ / MCQ)
  - `keywords` (text, comma-separated keywords for matching)
  - `search_vector` (tsvector, generated from question + keywords + answer for full-text search)
  - `hit_count` (int, default 0, tracks how many times this KB entry was used)
  - `created_at` (timestamptz)

2. Indexes
- GIN index on `search_vector` for fast full-text search
- Index on `subject` for filtering
- Index on `question_type` for filtering

3. Security
- RLS enabled on `knowledge_base`
- Read access for anon + authenticated (the KB is shared reference data, intentionally public)
- No write access from the frontend (KB is managed via migrations only)
*/

CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  subject text NOT NULL DEFAULT 'General',
  chapter text,
  question_type text,
  keywords text DEFAULT '',
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(question, '') || ' ' || coalesce(keywords, '') || ' ' || coalesce(answer, ''))
  ) STORED,
  hit_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_kb" ON knowledge_base;
CREATE POLICY "anon_read_kb" ON knowledge_base FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_kb_search_vector ON knowledge_base USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_kb_subject ON knowledge_base (subject);
CREATE INDEX IF NOT EXISTS idx_kb_question_type ON knowledge_base (question_type);
