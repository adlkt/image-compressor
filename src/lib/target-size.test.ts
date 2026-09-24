import assert from "node:assert/strict";
import test from "node:test";
import { findTargetEncoding } from "./target-size.ts";

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
