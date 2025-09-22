// lib/aws.ts
// Thin AWS SDK v3 wrappers for use in API routes.
// Matches your current imports: secrets(), lambda(), s3()

import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { S3Client } from "@aws-sdk/client-s3";

function getRegion() {
  return process.env.AWS_REGION || "us-east-1";
}

/** Secrets Manager client */
export function secrets() {
  return new SecretsManagerClient({ region: getRegion() });
}

/** Lambda client */
export function lambda() {
  return new LambdaClient({ region: getRegion() });
}

/** S3 client */
export function s3() {
  return new S3Client({ region: getRegion() });
}
