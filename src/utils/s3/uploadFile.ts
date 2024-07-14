import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createReadStream } from "fs";
import { basename } from "path";
import "dotenv/config";

export default function uploadFile(path: string) {
  const s3 = new S3Client({ region: "ap-northeast-2" });

  const file = createReadStream(path);
  const filename = basename(path);

  file.on("error", (err) => {
    throw err;
  });

  const s3UploadCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: filename,
    Body: file,
  });

  return s3.send(s3UploadCommand);
}
