import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

const ADS_BASE = process.env.ADS_API_BASE || "https://advertising-api.amazon.com";
const CLIENT_ID =
  process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_CLIENT_ID || "";

function secondsFromNow(s: number) {
  return new Date(Date.now() + s *
