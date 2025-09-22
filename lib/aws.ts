// lib/aws.ts
// Minimal server-side helpers used by API routes.
// Works on Vercel Node runtime (not Edge). Requires AWS_* envs if you call AWS directly.
// If you only call your provisioner via HTTPS, the AWS SDK is not required here.

type Json = Record<string, any>;

// --- HMAC signer for provisioner ---
function hmacSign(payload: string, secret: string) {
  const crypto = require("crypto");
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Call your brand provisioner HTTPS endpoint with HMAC header.
 * Expects PROVISIONER_URL and PROVISIONER_HMAC_SECRET in env.
 */
export async function callProvisioner(path: string, body: Json) {
  const url = `${process.env.PROVISIONER_URL?.replace(/\/$/, "")}${path}`;
  const json = JSON.stringify(body);
  const signature = hmacSign(json, process.env.PROVISIONER_HMAC_SECRET || "");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-hespor-signature": signature,
    },
    body: json,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Provisioner ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Lightweight S3 helpers via your provisioner (preferred for Vercel):
 * If you want to write directly to S3 from the app instead, wire AWS SDK here.
 * For now we go through the provisioner to keep credentials server-side.
 */
export async function putS3Json_viaProvisioner(bucket: string, key: string, data: Json) {
  return callProvisioner("/s3/put-json", { bucket, key, data });
}

export async function getS3Json_viaProvisioner(bucket: string, key: string) {
  return callProvisioner("/s3/get-json", { bucket, key });
}
