import "dotenv/config";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./lib/s3-client";

const bucket = process.env.S3_BUCKET_NAME || "assets";
const key = "uploads/file.txt";

async function main() {
  try {
    if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
      throw new Error("Missing S3 Access Keys. Please add them to .env.local");
    }

    console.log(`Uploading file to bucket "${bucket}"...`);
    await s3Client.send(new PutObjectCommand({ 
      Bucket: bucket, 
      Key: key, 
      Body: "Hello World from Next.js!" 
    }));
    console.log("Upload successful!");
    
    console.log("Generating presigned URL...");
    const url = await getSignedUrl(s3Client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 3600 });
    console.log(`\n[VIEW FILE] => ${url}\n`);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
