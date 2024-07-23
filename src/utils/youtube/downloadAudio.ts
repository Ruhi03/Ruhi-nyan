import youtubedl, { Payload } from "youtube-dl-exec";
import { readFileSync, unlinkSync } from "node:fs";
import logger from "../../logger";

export default async function downloadAudio(link: string, filepath: string) {
  return new Promise<Payload>((resolve, reject) => {
    youtubedl(link, {
      noCheckCertificates: true,
      noWarnings: true,
      addHeader: ["Referer:youtube.com", "User-Agent:Googlebot"],
      format: "bestaudio",
      extractAudio: true,
      audioFormat: "mp3",
      audioQuality: 0,
      output: filepath,
      writeInfoJson: true,
    })
      .then((stdout) => {
        logger.info(stdout);

        const metadataPath = `${filepath}.info.json`;
        const metadata = JSON.parse(
          readFileSync(metadataPath, { encoding: "utf-8" })
        );

        unlinkSync(metadataPath);
        resolve(metadata);
      })
      .catch((err) => {
        logger.error(err);
        console.error(err);
        reject(err);
      });
  });
}
