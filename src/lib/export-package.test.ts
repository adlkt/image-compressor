import assert from "node:assert/strict";
import test from "node:test";
import { crc32, createOutputNames, createZip, sanitizeFilename } from "./export-package.ts";

test("sanitizes path traversal and reserved device names", () => {
  assert.equal(sanitizeFilename("../CON:*?.jpg"), "-CON---.jpg");
  assert.equal(sanitizeFilename("CON"), "_CON");
  assert.equal(sanitizeFilename("..."), "image");
});

test("renders deterministic names and resolves collisions", () => {
  const input = [
    { originalName: "a/b.jpg", width: 800, height: 600, extension: "webp" },
    { originalName: "a\\b.png", width: 800, height: 600, extension: "webp" },
  ];
  assert.deepEqual(createOutputNames(input, "{name}"), ["a-b.webp", "a-b-2.webp"]);
  assert.equal(createOutputNames(input, "{n}-{width}x{height}")[0], "01-800x600.webp");
});

test("crc32 matches the standard check value", () => {
  assert.equal(crc32(new TextEncoder().encode("123456789")), 0xcbf43926);
});

test("creates a ZIP with local, central, and end records", async () => {
  const blob = await createZip([
    { name: "商品图.webp", data: "hello" },
    { name: "report.txt", data: "ok" },
  ]);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const view = new DataView(bytes.buffer);
  assert.equal(view.getUint32(0, true), 0x04034b50);
  assert.equal(view.getUint32(bytes.length - 22, true), 0x06054b50);
  assert.equal(view.getUint16(bytes.length - 14, true), 2);
  assert.equal(blob.type, "application/zip");
});
