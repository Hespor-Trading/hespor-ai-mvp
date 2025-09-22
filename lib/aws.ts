import { S3Client } from "@aws-sdk/client-s3";

export function s3() {
  const region = process.env.AWS_REGION || "us-east-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("Missing AWS credentials (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY)");
  }
  return new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
}
