/*
# Add 3-tier subscription system

1. Overview
   This migration introduces a 3-tier pricing/access system (FREE, PRO, PREMIUM)
   replacing the existing boolean is_pro flag. It also adds an app_config table
   with an admin-controlled toggle for enabling/disabling purchases.

2. New Columns
   - profiles.subscription_tier (text, NOT NULL, DEFAULT 'free')
     Values: 'free', 'pro', 'premium'. Determines the user's access level.
   - pro_upgrades.tier (text, nullable)
     Records which tier was purchased: 'pro' or 'premium'.
   - pro_upgrades.amount (integer, default 0)
     Records the payment amount in rupees (kept for future use).

3. New Tables
   - app_config (key-value store for app-wide settings)
     - key (text, primary key)
     - value (jsonb, NOT NULL)
     - updated_at (timestamptz, default now())
     - The row with key 'purchases_enabled' controls whether upgrade purchases
       are available to users. Default is false (purchases locked).

4. Security
   - RLS enabled on app_config.
   - Anyone (anon + authenticated) can READ config values (needed by the frontend
     to check if purchases are enabled).
   - Only authenticated users can UPDATE config values (admin toggle — in a real
     deployment this would be restricted further, but for now any signed-in user
     can toggle since there is no admin role concept yet).
   - Existing pro_upgrades policies remain unchanged.

5. Data Migration
   - Existing pro_upgrades rows with is_pro = true get tier = 'pro'.
   - All profiles get subscription_tier = 'free' by default (column default).
*/

-- Add subscription_tier to profiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_tier text NOT NULL DEFAULT 'free';
    ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_tier_check
      CHECK (subscription_tier IN ('free', 'pro', 'premium'));
  END IF;
END $$;

-- Add tier column to pro_upgrades
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pro_upgrades' AND column_name = 'tier'
  ) THEN
    ALTER TABLE pro_upgrades ADD COLUMN tier text;
    ALTER TABLE pro_upgrades ADD CONSTRAINT pro_upgrades_tier_check
      CHECK (tier IS NULL OR tier IN ('pro', 'premium'));
  END IF;
END $$;

-- Update existing pro_upgrades rows: set tier based on is_pro
UPDATE pro_upgrades SET tier = 'pro' WHERE is_pro = true AND tier IS NULL;

-- Change pro_upgrades.amount default to 0 (was 30, old hardcoded value)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pro_upgrades' AND column_name = 'amount'
      AND column_default = '30'
  ) THEN
    ALTER TABLE pro_upgrades ALTER COLUMN amount SET DEFAULT 0;
  END IF;
END $$;

-- Create app_config table
CREATE TABLE IF NOT EXISTS app_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read config (frontend needs to check purchase toggle)
DROP POLICY IF EXISTS "read_app_config" ON app_config;
CREATE POLICY "read_app_config" ON app_config FOR SELECT
  TO anon, authenticated USING (true);

-- Allow authenticated users to update config (admin toggle)
DROP POLICY IF EXISTS "update_app_config" ON app_config;
CREATE POLICY "update_app_config" ON app_config FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated users to insert config rows
DROP POLICY IF EXISTS "insert_app_config" ON app_config;
CREATE POLICY "insert_app_config" ON app_config FOR INSERT
  TO authenticated WITH CHECK (true);

-- Seed default config: purchases disabled
INSERT INTO app_config (key, value)
VALUES ('purchases_enabled', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;
