import { S3 } from "aws-sdk";

export const r2 = new S3({
    endpoint: process.env.R2_ENDPOINT,
    accessKeyId: process.env.R2_KEY_ID,
    secretAccessKey: process.env.R2_KEY_SECRET,
    signatureVersion: "v4",
    region: "auto"
});