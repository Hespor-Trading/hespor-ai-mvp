-- Create amazon_integrations table to track user's Amazon account connections
CREATE TABLE IF NOT EXISTS amazon_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Amazon Advertising API credentials
  ads_refresh_token TEXT,
  ads_access_token TEXT,
  ads_token_expires_at TIMESTAMPTZ,
  ads_profile_id TEXT,
  ads_marketplace_id TEXT,
  
  -- Amazon SP-API credentials
  sp_refresh_token TEXT,
  sp_access_token TEXT,
  sp_token_expires_at TIMESTAMPTZ,
  sp_seller_id TEXT,
  sp_marketplace_id TEXT,
  
  -- Connection status
  ads_connected BOOLEAN DEFAULT FALSE,
  sp_connected BOOLEAN DEFAULT FALSE,
  is_fully_connected BOOLEAN GENERATED ALWAYS AS (ads_connected AND sp_connected) STORED,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE amazon_integrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own integrations
CREATE POLICY "Users can view own integrations"
  ON amazon_integrations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own integrations
CREATE POLICY "Users can insert own integrations"
  ON amazon_integrations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own integrations
CREATE POLICY "Users can update own integrations"
  ON amazon_integrations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_amazon_integrations_user_id ON amazon_integrations(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_amazon_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_amazon_integrations_updated_at
  BEFORE UPDATE ON amazon_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_amazon_integrations_updated_at();

-- Function to check if user has completed Amazon integration
CREATE OR REPLACE FUNCTION has_amazon_integration(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM amazon_integrations 
    WHERE user_id = p_user_id 
    AND is_fully_connected = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
