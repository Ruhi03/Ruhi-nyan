import { expect, describe, test } from "vitest";
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import uploadFile from "../src/utils/s3/uploadFile";

describe("utils/s3/uploadFile 테스트", () => {
  const tempDir = "./tests/temp";

  test("임시 저장 공간 준비", () => {
    mkdirSync(tempDir, { recursive: true });

    expect(existsSync(tempDir)).toBe(true);
  });

  test("업로드 테스트", async () => {
    const filename = `${Date.now()}.txt`;
    const path = `${tempDir}/${filename}`;

    writeFileSync(path, "Hello, World!");

    const url = await uploadFile(path, filename);
    const res = await fetch(url);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello, World!");
  });
});
