import { expect, describe, test } from "vitest";
import {
  mkdirSync,
  existsSync,
  rmdirSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import uploadFile from "@/utils/s3/uploadFile";

describe("utils/s3/uploadFile 테스트", () => {
  const tempDir = "./tests/temp";

  test("임시 저장 공간 준비", () => {
    if (existsSync(tempDir)) rmdirSync(tempDir, { recursive: true });
    mkdirSync(tempDir, { recursive: true });

    expect(existsSync(tempDir)).toBe(true);
    expect(readdirSync(tempDir).length).toBe(0);
  });

  test("업로드 테스트", async () => {
    const filename = `${Date.now()}.txt`;
    const path = `${tempDir}/${filename}`;

    writeFileSync(path, "Hello, World!");

    await uploadFile(path);
    const res = await fetch(
      `https://${process.env.AWS_S3_BUCKET}.s3.ap-northeast-2.amazonaws.com/${filename}`
    );

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello, World!");
  });
});
