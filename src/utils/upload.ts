import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

export async function upload(videoTitle: string): Promise<string> {
    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
        }
    });
    const filePath = `./${videoTitle}.mp3`;

    // 파일이 진짜 존재하는지, 버퍼로 깔끔하게 읽어오기
    const fileBuffer = fs.readFileSync(filePath);

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${videoTitle}.mp3`,
        Body: fileBuffer, // 스트림 대신 버퍼 주입
        ContentType: "audio/mpeg"
    });

    await s3Client.send(command);
    console.log(`https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(videoTitle)}.mp3`)

    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(videoTitle)}.mp3`;
}