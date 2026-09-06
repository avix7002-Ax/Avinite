/*
# Fix claim_owner to check email for the 4th account

avi747922@gmail.com doesn't have a known UUID yet. The trigger handles
auto-setting is_owner on signup, but claim_owner() should also work for
that account by looking up the email. Update the function to check
auth.uid() against the 3 known UUIDs OR against the email of the caller.
*/

CREATE OR REPLACE FUNCTION claim_owner()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_email text;
  v_owner_emails text[] := ARRAY[
    'avix7002@gmail.com',
    'avinashsuryavanshi652@gmail.com',
    'avinashk2558@gmail.com',
    'avi747922@gmail.com'
  ];
BEGIN
  -- Check by known UUIDs first (fast path for existing owners)
  IF auth.uid()::text IN (
    '946debe8-8d2b-4aef-a50f-0729ae569cc6',
    'efe031fa-6925-40d6-b30e-73c89c08fdc4',
    'e7e59c50-0377-4965-8bc2-a2fc4f53a752'
  ) THEN
    UPDATE profiles SET is_owner = true WHERE id = auth.uid();
    RETURN;
  END IF;

  -- Fallback: check by email (covers accounts not yet in the UUID list)
  SELECT email INTO v_email FROM auth.users WHERE id = auth.uid();
  IF v_email = ANY(v_owner_emails) THEN
    UPDATE profiles SET is_owner = true WHERE id = auth.uid();
    RETURN;
  END IF;

  RAISE EXCEPTION 'Not authorized';
END;
$$;

REVOKE EXECUTE ON FUNCTION claim_owner() FROM anon;
GRANT EXECUTE ON FUNCTION claim_owner() TO authenticated;
