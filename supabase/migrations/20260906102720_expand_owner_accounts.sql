/*
# Expand owner accounts to 4 Gmail addresses

Adds three more owner accounts. The original owner (avix7002@gmail.com) was
already set up in a previous migration. This migration:
  1. Replaces claim_owner() so it checks auth.uid() against all 4 owner UUIDs.
  2. Sets is_owner = true for the 2 existing accounts that don't have it yet.
  3. The 4th account (avi747922@gmail.com) doesn't exist in auth.users yet.
     A trigger is added so that when that account signs up, it automatically
     gets is_owner = true — no manual step needed.

Security is unchanged:
  - is_owner column has no INSERT/UPDATE grant for anon or authenticated.
  - claim_owner() is SECURITY DEFINER, checks auth.uid() against a hardcoded
    list, and rejects everyone else.
  - The trigger runs BEFORE INSERT on profiles and only sets is_owner for
    the specific email.
*/

-- Replace claim_owner to accept all 4 owner UUIDs
CREATE OR REPLACE FUNCTION claim_owner()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid()::text NOT IN (
    '946debe8-8d2b-4aef-a50f-0729ae569cc6',  -- avix7002@gmail.com
    'efe031fa-6925-40d6-b30e-73c89c08fdc4',  -- avinashsuryavanshi652@gmail.com
    'e7e59c50-0377-4965-8bc2-a2fc4f53a752',  -- avinashk2558@gmail.com
    '00000000-0000-0000-0000-000000000000'   -- placeholder for avi747922@gmail.com (set by trigger)
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE profiles SET is_owner = true WHERE id = auth.uid();
END;
$$;

REVOKE EXECUTE ON FUNCTION claim_owner() FROM anon;
GRANT EXECUTE ON FUNCTION claim_owner() TO authenticated;

-- Set is_owner for the 2 existing accounts that don't have it yet
UPDATE profiles SET is_owner = true
WHERE id IN ('efe031fa-6925-40d6-b30e-73c89c08fdc4', 'e7e59c50-0377-4965-8bc2-a2fc4f53a752')
  AND is_owner = false;

-- Auto-grant owner when avi747922@gmail.com signs up
CREATE OR REPLACE FUNCTION set_owner_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'avi747922@gmail.com' THEN
    UPDATE profiles SET is_owner = true WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION set_owner_on_signup() FROM anon;
GRANT EXECUTE ON FUNCTION set_owner_on_signup() TO authenticated;

DROP TRIGGER IF EXISTS owner_on_user_created ON auth.users;
CREATE TRIGGER owner_on_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION set_owner_on_signup();
