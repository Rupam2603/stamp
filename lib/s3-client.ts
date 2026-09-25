import { S3Client } from "@aws-sdk/client-s3";

const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || "us-east-1";
const endpoint = process.env.S3_ENDPOINT; // Optional, for custom providers

if (!accessKeyId || !secretAccessKey) {
  console.warn("Missing S3 credentials.");
}

export const s3Client = new S3Client({
  forcePathStyle: true,
  region,
  ...(endpoint && { endpoint }),
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});
