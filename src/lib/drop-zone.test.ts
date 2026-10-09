import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../components/drop-zone.tsx", import.meta.url),
  "utf8",
);
const queueSource = readFileSync(
  new URL("../components/file-queue.tsx", import.meta.url),
  "utf8",
);
const nextConfigSource = readFileSync(
  new URL("../../next.config.ts", import.meta.url),
  "utf8",
);

test("可见选择区域由原生 file input 直接覆盖", () => {
  assert.match(
    source,
    /<input[\s\S]*id="file-input"[\s\S]*absolute inset-0[\s\S]*opacity-0/,
  );
  assert.match(
    queueSource,
    /<input[\s\S]*id="file-input-queue"[\s\S]*absolute inset-0[\s\S]*opacity-0/,
  );
  assert.doesNotMatch(source, /showPicker\s*\(/);
  assert.doesNotMatch(queueSource, /showPicker\s*\(/);
});

test("127.0.0.1 可以加载 Next.js 开发资源并完成 hydration", () => {
  assert.match(nextConfigSource, /allowedDevOrigins:\s*\["127\.0\.0\.1"\]/);
});
