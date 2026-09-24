import assert from "node:assert/strict";
import test from "node:test";
import { isHeicInput, isSupportedImageInput } from "./image-input.ts";

test("accepts HEIC and HEIF files even when the browser omits their MIME type", () => {
  assert.equal(isHeicInput({ name: "IMG_0001.HEIC", type: "" }), true);
  assert.equal(isHeicInput({ name: "portrait.heif", type: "application/octet-stream" }), true);
  assert.equal(isSupportedImageInput({ name: "IMG_0001.HEIC", type: "" }), true);
});

test("accepts normal images and rejects unrelated files", () => {
  assert.equal(isSupportedImageInput({ name: "photo.jpg", type: "image/jpeg" }), true);
  assert.equal(isSupportedImageInput({ name: "notes.txt", type: "text/plain" }), false);
});
