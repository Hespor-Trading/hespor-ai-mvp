import { createClient } from "@/lib/supabase/server"

export interface AmazonIntegration {
  id: string
  user_id: string
  ads_connected: boolean
  sp_connected: boolean
  is_fully_connected: boolean
  created_at: string
  updated_at: string
}

export async function getAmazonIntegration(userId: string): Promise<AmazonIntegration | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("amazon_integrations").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching Amazon integration:", error)
    return null
  }

  return data
}

export async function createAmazonIntegration(userId: string): Promise<AmazonIntegration | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("amazon_integrations")
    .insert({
      user_id: userId,
      ads_connected: false,
      sp_connected: false,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating Amazon integration:", error)
    return null
  }

  return data
}

export async function updateAmazonIntegration(
  userId: string,
  updates: {
    ads_connected?: boolean
    sp_connected?: boolean
    ads_refresh_token?: string
    sp_refresh_token?: string
  },
): Promise<AmazonIntegration | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("amazon_integrations")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating Amazon integration:", error)
    return null
  }

  return data
}

export async function isAmazonConnected(userId: string): Promise<boolean> {
  const integration = await getAmazonIntegration(userId)
  return integration?.is_fully_connected ?? false
}
