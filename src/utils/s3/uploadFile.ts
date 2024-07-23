import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createReadStream } from "fs";
import "dotenv/config";
import logger from "../../logger";

export default async function uploadFile(path: string, filename: string) {
  return new Promise<string>((resolve, reject) => {
    const region = process.env.AWS_S3_REGION;
    const bucket = process.env.AWS_S3_BUCKET;

    if (!region || !bucket) {
      reject("AWS S3 정보가 없습니다.");
    }

    const s3 = new S3Client({ region, forcePathStyle: true });

    const file = createReadStream(path);

    file.on("error", (err) => {
      logger.error(err);
      reject(err);
    });

    const s3UploadCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      Body: file,
    });

    s3.send(s3UploadCommand).then(() => {
      resolve(
        `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(
          filename
        )}`
      );
    });
  });
}
