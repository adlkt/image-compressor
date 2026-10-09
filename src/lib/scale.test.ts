import assert from "node:assert/strict";
import test from "node:test";
import { scaleDomain, scalePosition, scaleTicks, formatTick, batchDomain } from "./scale.ts";

const KB = 1024;
const MB = 1024 * KB;

test("falls back to a usable range when there is nothing to measure", () => {
  const domain = scaleDomain([]);
  assert.ok(domain.lo > 0);
  assert.ok(domain.hi > domain.lo);
});

test("ignores zero and non-finite readings", () => {
  assert.deepEqual(scaleDomain([0, Number.NaN, 0]), scaleDomain([]));
});

test("keeps a wide dynamic range readable: 380 KB and 12.4 MB share one scale", () => {
  const domain = scaleDomain([380 * KB, 12.4 * MB]);
  const small = scalePosition(380 * KB, domain);
  const large = scalePosition(12.4 * MB, domain);

  // 小的那个不能贴在左端，两者之间要有可读的间隔
  assert.ok(small > 0.15, `380 KB 落在 ${small}，太靠左`);
  assert.ok(large < 0.98, `12.4 MB 落在 ${large}，太靠右`);
  assert.ok(large - small > 0.4, "两端数值挤在一起了");
});

test("never leaves a reading pinned to either end of the scale", () => {
  const domain = scaleDomain([500 * KB, 12 * MB]);
  assert.ok(scalePosition(500 * KB, domain) > 0);
  assert.ok(scalePosition(12 * MB, domain) < 1);
});

test("clamps readings outside the domain instead of overflowing", () => {
  const domain = scaleDomain([500 * KB, 12 * MB]);
  assert.equal(scalePosition(1, domain), 0);
  assert.equal(scalePosition(999 * MB, domain), 1);
});

test("positions increase monotonically", () => {
  const domain = scaleDomain([500 * KB, 12 * MB]);
  const positions = [100 * KB, 500 * KB, 2 * MB, 8 * MB, 12 * MB].map((bytes) =>
    scalePosition(bytes, domain),
  );
  for (let i = 1; i < positions.length; i++) {
    assert.ok(positions[i] > positions[i - 1], `第 ${i} 个数值没有递增`);
  }
});

test("ticks land on round binary values and format cleanly", () => {
  const domain = scaleDomain([500 * KB, 12 * MB]);
  const ticks = scaleTicks(domain);

  assert.ok(ticks.length >= 6);
  assert.equal(ticks[0].position, 0);
  assert.equal(ticks[ticks.length - 1].position, 1);

  for (const tick of ticks) {
    assert.equal(Number.isInteger(Math.log2(tick.bytes)), true);
    if (tick.label !== null) assert.doesNotMatch(tick.label, /\.0\s/, "刻度标签不该带 .0");
  }
});

test("labels at most every other tick when the range is very wide", () => {
  const domain = scaleDomain([2 * KB, 2 * 1024 * MB]);
  const labelled = scaleTicks(domain).filter((tick) => tick.label !== null);
  const all = scaleTicks(domain);

  assert.ok(labelled.length * 2 <= all.length + 1, "标签太密");
});

test("formats tick labels without a meaningless decimal", () => {
  assert.equal(formatTick(512 * KB), "512 KB");
  assert.equal(formatTick(MB), "1 MB");
  assert.equal(formatTick(8 * MB), "8 MB");
});

test("one batch shares one scale, so a common target lands at one position", () => {
  // 4.1 MB 的大图 + 238 KB 的小图，同一个 500 KB 目标
  const large = { original: 4.1 * MB, compressed: 27 * KB, target: 500 * KB };
  const small = { original: 238 * KB, compressed: 7 * KB, target: 500 * KB };

  // 事件前的行为：每行各自配域，同一根目标线落在两个位置
  // （实测 59.6% 与 87.1%）——「对齐的一列刻度」于是否定了自己。
  const perRow = [large, small].map((row) =>
    scalePosition(500 * KB, scaleDomain([row.original, row.compressed, row.target])),
  );
  assert.ok(
    Math.abs(perRow[0] - perRow[1]) > 0.2,
    `各自配域时两行本该错开到 0.2 以上，实测差 ${Math.abs(perRow[0] - perRow[1])}`,
  );

  // 共用同一个域之后，同一根目标线全批只有一个位置
  const domain = batchDomain([large, small]);
  const shared = scalePosition(500 * KB, domain);
  assert.ok(
    Math.abs(shared - perRow[0]) > 0.01 || Math.abs(shared - perRow[1]) > 0.01,
    "共用域与两行各自的域读出的位置一样，换域没有生效",
  );
  assert.ok(shared > 0.05 && shared < 0.95, `目标线落到了域外面：${shared}`);
});

test("batch domain contains every reading in the batch", () => {
  const domain = batchDomain([
    { original: 4.1 * MB, compressed: 27 * KB, target: 500 * KB },
    { original: 238 * KB, compressed: null, target: 800 * KB },
  ]);

  for (const bytes of [27 * KB, 238 * KB, 500 * KB, 800 * KB, 4.1 * MB]) {
    const position = scalePosition(bytes, domain);
    assert.ok(position > 0 && position < 1, `${bytes} 贴到了域边缘`);
  }
});

test("batch domain of nothing still yields a usable scale", () => {
  const domain = batchDomain([{ original: null, compressed: null, target: null }]);
  assert.ok(domain.hi > domain.lo);
});

test("size bar: one batch is one axis, so a bigger original always draws longer", () => {
  const rows = [
    { original: 4.1 * MB, compressed: 380 * KB, target: 500 * KB },
    { original: 238 * KB, compressed: 27 * KB, target: 500 * KB },
  ];
  const domain = batchDomain(rows);

  // 同一个字节数在批内只有一种长度，不随它落在哪一行而变
  assert.equal(scalePosition(4.1 * MB, domain), scalePosition(rows[0].original, domain));
  assert.equal(scalePosition(238 * KB, domain), scalePosition(rows[1].original, domain));

  // 更大的原图必须画得更长——「看起来余量更大」不能是尺子被拉长的结果
  assert.ok(
    scalePosition(rows[0].original, domain) > scalePosition(rows[1].original, domain),
    "原图更大的那一行反而画得更短，共用域没有生效",
  );
  assert.ok(scalePosition(380 * KB, domain) > scalePosition(27 * KB, domain));
});

test("size bar: the result never draws past the original", () => {
  const domain = batchDomain([
    { original: 4.1 * MB, compressed: 27 * KB, target: 500 * KB },
    { original: 238 * KB, compressed: 61 * KB, target: 500 * KB },
  ]);

  for (const { original, compressed } of [
    { original: 4.1 * MB, compressed: 27 * KB },
    { original: 238 * KB, compressed: 61 * KB },
  ]) {
    assert.ok(
      scalePosition(compressed, domain) < scalePosition(original, domain),
      "结果条超出了原图条，变小了这件事在图上不成立",
    );
  }
});
