-- Credentials table for Amazon Ads (and future providers)
CREATE TABLE IF NOT EXISTS ads_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'ads', -- 'ads' for Amazon Advertising
  refresh_token TEXT,
  access_token TEXT,
  token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, provider)
);

-- RLS
ALTER TABLE ads_credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own ads credentials"
  ON ads_credentials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own ads credentials"
  ON ads_credentials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ads credentials"
  ON ads_credentials FOR UPDATE USING (auth.uid() = user_id);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION update_ads_credentials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ads_credentials_updated_at ON ads_credentials;
CREATE TRIGGER update_ads_credentials_updated_at
  BEFORE UPDATE ON ads_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_ads_credentials_updated_at();

-- Add last_synced_at to amazon_integrations to track data readiness
ALTER TABLE amazon_integrations
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;
