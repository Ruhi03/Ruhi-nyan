import youtubedl from "youtube-dl-exec";

export default function downloadAudio(link: string, filename?: string) {
  return youtubedl(link, {
    noCheckCertificates: true,
    noWarnings: true,
    addHeader: ["Referer:youtube.com", "User-Agent:Googlebot"],
    format: "bestaudio[acodec=mp4a.40.2]",
    output: filename,
    writeInfoJson: true,
  });
}
