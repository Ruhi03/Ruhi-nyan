import { expect, describe, test } from "vitest";
import { mkdirSync, existsSync, readdirSync, readFileSync } from "node:fs";
import downloadAudio from "../src/utils/youtube/downloadAudio";
import { Payload } from "youtube-dl-exec";

describe("utils/youtube/downloadAudio 테스트", () => {
  const tempDir = "./tests/temp";

  test("임시 저장 공간 준비", () => {
    mkdirSync(tempDir, { recursive: true });

    expect(existsSync(tempDir)).toBe(true);
  });

  test("다운로드 테스트", async () => {
    const title =
      "ILLIT 'Magnetic' Lyrics (아일릿 Magnetic 가사) (Color Coded Lyrics)";
    const videoId = "9UsfSpQqQ6c";

    const uuid = crypto.randomUUID();
    const filename = `${uuid}.mp3`;
    const musicPath = `tests/temp/${filename}`;

    const metadata = await downloadAudio(videoId, musicPath);

    expect(metadata.title).toBe(title);
    expect(readdirSync(tempDir).find((name) => name == filename)).toBe(
      filename
    );
  }, 10000);
});
