/*
# Create AI Response Cache Table

## Purpose
Caches frequently-asked educational questions (NCERT concepts, definitions, formula explanations)
so repeat questions get instant responses without calling Gemini again.

## Changes
1. New table: `ai_response_cache`
   - `id` (uuid PK)
   - `cache_key` (text, unique) — SHA-256 hash of message+style+language+mode
   - `question` (text) — original question for debugging
   - `response` (text) — cached AI response
   - `subject` (text, nullable) — detected subject for categorization
   - `hit_count` (int, default 1) — how many times this cache entry was used
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)
   - `expires_at` (timestamptz) — cache entry validity (7 days)

2. Index on `cache_key` for fast lookups
3. Index on `subject` for potential pre-warming

## Security
- RLS enabled with anon+authenticated read (cache is shared educational content)
- Only authenticated users can insert/update (the edge function uses service role key which bypasses RLS)
*/

CREATE TABLE IF NOT EXISTS ai_response_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text UNIQUE NOT NULL,
  question text NOT NULL,
  response text NOT NULL,
  subject text,
  hit_count integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT now() + interval '7 days'
);

CREATE INDEX IF NOT EXISTS idx_ai_cache_key ON ai_response_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_ai_cache_subject ON ai_response_cache(subject);

ALTER TABLE ai_response_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_cache" ON ai_response_cache;
CREATE POLICY "anon_read_cache" ON ai_response_cache FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_cache" ON ai_response_cache;
CREATE POLICY "auth_insert_cache" ON ai_response_cache FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_cache" ON ai_response_cache;
CREATE POLICY "auth_update_cache" ON ai_response_cache FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
