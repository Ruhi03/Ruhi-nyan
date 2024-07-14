import { expect, describe, test } from "vitest";
import {
  mkdirSync,
  existsSync,
  rmdirSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import downloadAudio from "@/utils/youtube/downloadAudio";

describe("utils/youtube/downloadAudio 테스트", () => {
  const tempDir = "./tests/temp";

  test("임시 저장 공간 준비", () => {
    if (existsSync(tempDir)) rmdirSync(tempDir, { recursive: true });
    mkdirSync(tempDir, { recursive: true });

    expect(existsSync(tempDir)).toBe(true);
    expect(readdirSync(tempDir).length).toBe(0);
  });

  test("다운로드 테스트", async () => {
    const title =
      "ILLIT 'Magnetic' Lyrics (아일릿 Magnetic 가사) (Color Coded Lyrics)";
    const videoId = "9UsfSpQqQ6c";
    const filename = crypto.randomUUID();

    await downloadAudio(videoId, `tests/temp/${filename}.webm`);
    const metadata = JSON.parse(
      readFileSync(`tests/temp/${filename}.info.json`, { encoding: "utf-8" })
    );

    expect(metadata.title).toBe(title);
    expect(metadata.ext).toBe("webm");
    expect(metadata.acodec).toBe("opus");
    expect(
      readdirSync(tempDir).find((filename) => filename.endsWith("webm"))
    ).toBe(`${filename}.webm`);
  });
});
