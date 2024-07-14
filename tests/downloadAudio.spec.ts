import { expect, describe, test } from "vitest";
import {
  mkdirSync,
  existsSync,
  rmdirSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import downloadAudio from "../src/utils/youtube/downloadAudio";

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
    const basename = `${filename}.mp3`;

    await downloadAudio(videoId, `tests/temp/${basename}`);
    const metadata = JSON.parse(
      readFileSync(`tests/temp/${basename}.info.json`, { encoding: "utf-8" })
    );

    expect(metadata.title).toBe(title);
    expect(metadata.ext).toBe("m4a");
    expect(
      readdirSync(tempDir).find((filename) => filename.endsWith("mp3"))
    ).toBe(`${basename}`);
  });
});
