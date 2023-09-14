import { S3 } from "aws-sdk";

export const r2 = new S3({
    endpoint: `https://566ccbfc5b9008e65ab6490435cda9a3.r2.cloudflarestorage.com`,
    accessKeyId: process.env.R2_KEY_ID,
    secretAccessKey: process.env.R2_KEY_SECRET,
    signatureVersion: "v4",
});