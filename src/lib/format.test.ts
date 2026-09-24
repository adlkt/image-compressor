import assert from "node:assert/strict";
import test from "node:test";
import { compressionRatio, formatDelta, formatSize } from "./format.ts";

test("formats sizes with binary units", () => {
  assert.equal(formatSize(512), "512 B");
  assert.equal(formatSize(1024), "1 KB");
  assert.equal(formatSize(512 * 1024), "512 KB");
  assert.equal(formatSize(1024 * 1024), "1.0 MB");
});

test("does not round a near-total saving up to 100%", () => {
  // 5.9 MB 压到 28 KB：说成 -100% 等于谎称文件被压没了
  const ratio = compressionRatio(5_900_000, 28_000);
  assert.ok(ratio !== null);
  assert.equal(formatDelta(ratio), "-99.5%");
});

test("still reports a plain number when it is nowhere near total loss", () => {
  assert.equal(formatDelta(compressionRatio(4_000_000, 800_000)!), "-80%");
  assert.equal(formatDelta(compressionRatio(1000, 1000)!), "0%");
});

test("marks a file that grew with a plus sign", () => {
  assert.equal(formatDelta(compressionRatio(1000, 1500)!), "+50%");
});

test("returns null instead of a ratio while there is no result yet", () => {
  assert.equal(compressionRatio(1000, null), null);
});
