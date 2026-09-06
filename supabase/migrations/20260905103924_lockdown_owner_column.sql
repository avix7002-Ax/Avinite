/*
# Lock down is_owner column

The previous migration revoked UPDATE(is_owner) FROM authenticated, but
Supabase's authenticated role inherits from anon, so the grant survived.
Revoke from both anon and authenticated for both UPDATE and INSERT, so
no client-side request can set or change is_owner. Only the service_role
and postgres superuser retain access (used by the SECURITY DEFINER
function and server-side operations).
*/

REVOKE UPDATE (is_owner) ON profiles FROM anon;
REVOKE UPDATE (is_owner) ON profiles FROM authenticated;
REVOKE INSERT (is_owner) ON profiles FROM anon;
REVOKE INSERT (is_owner) ON profiles FROM authenticated;
