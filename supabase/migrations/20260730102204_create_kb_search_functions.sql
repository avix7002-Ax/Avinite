/*
# Create search_kb RPC function for knowledge base full-text search

1. New Functions
- `search_kb(search_query text)`: Returns the best-matching knowledge_base entry using PostgreSQL full-text search (websearch_to_tsquery + ts_rank). Returns at most 1 row with id, question, answer, subject, question_type. Only returns matches with rank > 0.01 to avoid false positives.

2. Also creates `increment_kb_hit(entry_id uuid)`: Atomically increments hit_count for a KB entry.

3. Security
- Both functions are callable by anon and authenticated roles (SECURITY DEFINER with search_path set to public).
- Read-only — no data modification beyond hit_count increment.

4. Notes
- websearch_to_tsquery handles natural language queries with AND/OR logic.
- ts_rank orders by relevance; we also factor in hit_count as a secondary sort.
- The rank threshold of 0.01 filters out weak matches so unrelated questions don't get a false KB hit.
*/

-- Drop existing if re-running
DROP FUNCTION IF EXISTS search_kb(text);
DROP FUNCTION IF EXISTS increment_kb_hit(uuid);

-- Main search function
CREATE FUNCTION search_kb(search_query text)
RETURNS TABLE (
  id uuid,
  question text,
  answer text,
  subject text,
  question_type text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.question,
    kb.answer,
    kb.subject,
    kb.question_type
  FROM knowledge_base kb
  WHERE kb.search_vector @@ websearch_to_tsquery('english', search_query)
    AND ts_rank(kb.search_vector, websearch_to_tsquery('english', search_query)) > 0.01
  ORDER BY
    ts_rank(kb.search_vector, websearch_to_tsquery('english', search_query)) DESC,
    kb.hit_count DESC
  LIMIT 1;
END;
$$;

-- Hit count increment function
CREATE FUNCTION increment_kb_hit(entry_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE knowledge_base SET hit_count = hit_count + 1 WHERE id = entry_id;
END;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION search_kb(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_kb_hit(uuid) TO anon, authenticated;
