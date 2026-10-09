import assert from "node:assert/strict";
import test from "node:test";
import { findTargetEncoding, sourceAlreadyMetTarget } from "./target-size.ts";

const fakeEncode = async (quality: number) =>
  new Blob([new Uint8Array(quality * 1_000)]);

test("returns the requested quality when no target is configured", async () => {
  const result = await findTargetEncoding({ maxQuality: 80, targetBytes: null, encode: fakeEncode });
  assert.equal(result.quality, 80);
  assert.equal(result.targetMet, true);
});

test("finds the highest tested quality that fits the target", async () => {
  const result = await findTargetEncoding({ maxQuality: 90, targetBytes: 55_000, encode: fakeEncode });
  assert.equal(result.quality, 55);
  assert.equal(result.blob.size, 55_000);
  assert.equal(result.targetMet, true);
});

test("returns the smallest result and reports an unmet target", async () => {
  const result = await findTargetEncoding({ maxQuality: 80, targetBytes: 10_000, encode: fakeEncode });
  assert.equal(result.quality, 20);
  assert.equal(result.targetMet, false);
});

test("tells apart a target the source already met from one this run achieved", () => {
  // 168 KB 的原图对着 1 MB 的目标：达标是原图的事实，压缩没证明任何事
  assert.equal(sourceAlreadyMetTarget(168 * 1024, 1024 * 1024), true);
  assert.equal(sourceAlreadyMetTarget(168 * 1024, 100 * 1024), false);
  // 边界：正好等于目标也算已经满足
  assert.equal(sourceAlreadyMetTarget(500 * 1024, 500 * 1024), true);
  // 没设目标就无所谓「已经达标」
  assert.equal(sourceAlreadyMetTarget(168 * 1024, null), false);
});
