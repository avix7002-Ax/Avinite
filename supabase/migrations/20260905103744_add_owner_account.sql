/*
# Add secure owner account

1. Purpose
   Grant a single hardcoded owner account full free access to every Free, Pro
   and Premium feature, including unlimited questions and AI/Companion AI usage.
   All other users keep the existing ₹0/₹49/₹99 pricing, limits and restrictions.

2. Security design
   - An `is_owner` column is added to `profiles` (boolean, default false).
   - Users CANNOT set `is_owner` on themselves: column-level UPDATE privilege
     for `is_owner` is revoked from `authenticated`. The existing row-level
     UPDATE policy still allows users to update their own row, but the revoked
     column privilege takes precedence and blocks writes to `is_owner`.
   - A `SECURITY DEFINER` function `claim_owner` runs as the table owner and
     bypasses RLS. It checks `auth.uid()` against a hardcoded UUID. Only that
     exact session can flip its own `is_owner` to true. No one else can call
     it successfully because the function raises an exception if the caller
     does not match.
   - `claim_owner` is executable by `authenticated` only (not anon).

3. Owner UUID
   946debe8-8d2b-4aef-a50f-0729ae569cc6  (avix7002@gmail.com — first account)
*/

-- Add is_owner column to profiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_owner'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_owner boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Revoke column-level UPDATE on is_owner so users cannot self-grant
REVOKE UPDATE (is_owner) ON profiles FROM authenticated;

-- SECURITY DEFINER function: only the hardcoded owner can call this
CREATE OR REPLACE FUNCTION claim_owner()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- The owner is identified by auth.uid(), NOT a parameter, so it cannot be forged.
  IF auth.uid()::text <> '946debe8-8d2b-4aef-a50f-0729ae569cc6' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE profiles SET is_owner = true WHERE id = auth.uid();
END;
$$;

REVOKE EXECUTE ON FUNCTION claim_owner() FROM anon;
GRANT EXECUTE ON FUNCTION claim_owner() TO authenticated;

-- Set the owner flag for the owner account directly (server-side, safe)
UPDATE profiles SET is_owner = true WHERE id = '946debe8-8d2b-4aef-a50f-0729ae569cc6';
