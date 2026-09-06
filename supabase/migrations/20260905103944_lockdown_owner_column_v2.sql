/*
# Lock down is_owner column — table-level revoke approach

Column-level REVOKE didn't stick because Supabase re-grants privileges on
the authenticated/anon roles. Instead, revoke the entire table UPDATE and
INSERT from anon and authenticated, then GRANT only the columns users are
allowed to write. is_owner is deliberately excluded from the grant list.

Users can still:
- UPDATE: full_name, avatar_url, target_percentage, exam_date,
  daily_study_hours, subscription_tier, updated_at
- INSERT: id, full_name, avatar_url, target_percentage, exam_date,
  daily_study_hours, subscription_tier

They CANNOT write: is_owner (no grant), created_at (no grant)
*/

-- Revoke broad table-level UPDATE and INSERT
REVOKE UPDATE ON profiles FROM anon;
REVOKE UPDATE ON profiles FROM authenticated;
REVOKE INSERT ON profiles FROM anon;
REVOKE INSERT ON profiles FROM authenticated;

-- Re-grant UPDATE only on user-editable columns
GRANT UPDATE (full_name, avatar_url, target_percentage, exam_date, daily_study_hours, subscription_tier, updated_at) ON profiles TO anon;
GRANT UPDATE (full_name, avatar_url, target_percentage, exam_date, daily_study_hours, subscription_tier, updated_at) ON profiles TO authenticated;

-- Re-grant INSERT only on user-editable columns (is_owner excluded)
GRANT INSERT (id, full_name, avatar_url, target_percentage, exam_date, daily_study_hours, subscription_tier) ON profiles TO anon;
GRANT INSERT (id, full_name, avatar_url, target_percentage, exam_date, daily_study_hours, subscription_tier) ON profiles TO authenticated;

-- Re-grant SELECT so users can still read their own profile (including is_owner for frontend checks)
GRANT SELECT ON profiles TO anon;
GRANT SELECT ON profiles TO authenticated;
