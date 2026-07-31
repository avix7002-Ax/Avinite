/*
# Expand AI Memory for V2 Intelligence

## Purpose
Adds columns to the `ai_memory` table to support richer long-term memory:
student class, stream, board, exam target, weak subjects, study style, and daily goals.
Also changes the default for `memory_enabled` to TRUE so memory starts ON.

## Changes
1. New columns on `ai_memory`:
   - `student_class` (text) — e.g. "Class 10"
   - `stream` (text) — e.g. "Science", "Commerce"
   - `board` (text) — e.g. "CBSE", "ICSE", "State Board"
   - `exam` (text) — e.g. "Board Exam 2026", "NEET"
   - `weak_subjects` (text) — subjects the student struggles with
   - `study_style` (text) — e.g. "Visual", "Auditory", "Practical"
   - `daily_goals` (text) — daily study goals
2. Changes default of `memory_enabled` from false to true.

## Security
No new tables. No policy changes. RLS already enabled with owner-scoped policies.

## Notes
- All new columns are nullable so existing rows are unaffected.
- The `memory_enabled` default change only applies to NEW rows.
- Existing rows keep their current `memory_enabled` value.
*/

ALTER TABLE ai_memory
  ADD COLUMN IF NOT EXISTS student_class text,
  ADD COLUMN IF NOT EXISTS stream text,
  ADD COLUMN IF NOT EXISTS board text,
  ADD COLUMN IF NOT EXISTS exam text,
  ADD COLUMN IF NOT EXISTS weak_subjects text,
  ADD COLUMN IF NOT EXISTS study_style text,
  ADD COLUMN IF NOT EXISTS daily_goals text;

ALTER TABLE ai_memory
  ALTER COLUMN memory_enabled SET DEFAULT true;
