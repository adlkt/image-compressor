export type NamingInput = {
  originalName: string;
  width: number;
  height: number;
  extension: string;
};

export type ZipEntry = { name: string; data: Blob | Uint8Array | string };

const RESERVED_NAMES = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i;

export function sanitizeFilename(value: string): string {
  const cleaned = value
    .normalize("NFC")
    .replace(/[\u0000-\u001f<>:"/\\|?*]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^[. ]+/g, "")
    .replace(/[. ]+$/g, "")
    .trim()
    .slice(0, 120);
  if (!cleaned) return "image";
  return RESERVED_NAMES.test(cleaned) ? `_${cleaned}` : cleaned;
}

export function createOutputNames(
  inputs: NamingInput[],
  template = "{name}-{n}",
): string[] {
  const used = new Map<string, number>();
  return inputs.map((input, index) => {
    const originalBase = input.originalName.replace(/\.[^.]+$/, "");
    const rendered = template
      .slice(0, 100)
      .replaceAll("{name}", originalBase)
      .replaceAll("{n}", String(index + 1).padStart(2, "0"))
      .replaceAll("{width}", String(input.width))
      .replaceAll("{height}", String(input.height));
    const base = sanitizeFilename(rendered);
    const collisionKey = `${base}.${input.extension}`.toLocaleLowerCase("en-US");
    const collisionIndex = (used.get(collisionKey) ?? 0) + 1;
    used.set(collisionKey, collisionIndex);
    const uniqueBase = collisionIndex === 1 ? base : `${base}-${collisionIndex}`;
    return `${uniqueBase}.${input.extension}`;
  });
}

let crcTable: Uint32Array | null = null;
function getCrcTable() {
  if (crcTable) return crcTable;
  crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let value = n;
    for (let k = 0; k < 8; k += 1) {
      value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    crcTable[n] = value >>> 0;
  }
  return crcTable;
}

export function crc32(bytes: Uint8Array): number {
  const table = getCrcTable();
  let crc = 0xffffffff;
  for (const byte of bytes) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function write16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function write32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true);
}

async function toBytes(data: ZipEntry["data"]): Promise<Uint8Array> {
  if (typeof data === "string") return new TextEncoder().encode(data);
  if (data instanceof Uint8Array) return data;
  return new Uint8Array(await data.arrayBuffer());
}

export async function createZip(entries: ZipEntry[]): Promise<Blob> {
  if (entries.length > 500) throw new Error("ZIP entry limit exceeded");
  const encoder = new TextEncoder();
  const prepared = [] as Array<{
    name: Uint8Array;
    data: Uint8Array;
    crc: number;
    offset: number;
  }>;
  let localSize = 0;

  for (const entry of entries) {
    const safeName = sanitizeFilename(entry.name);
    const name = encoder.encode(safeName);
    const data = await toBytes(entry.data);
    if (data.byteLength > 0xffffffff || localSize + data.byteLength > 512 * 1024 * 1024) {
      throw new Error("ZIP size limit exceeded");
    }
    prepared.push({ name, data, crc: crc32(data), offset: localSize });
    localSize += 30 + name.byteLength + data.byteLength;
  }

  const centralSize = prepared.reduce((sum, entry) => sum + 46 + entry.name.byteLength, 0);
  const output = new Uint8Array(localSize + centralSize + 22);
  const view = new DataView(output.buffer);
  let cursor = 0;

  for (const entry of prepared) {
    write32(view, cursor, 0x04034b50);
    write16(view, cursor + 4, 20);
    write16(view, cursor + 6, 0x0800);
    write32(view, cursor + 14, entry.crc);
    write32(view, cursor + 18, entry.data.byteLength);
    write32(view, cursor + 22, entry.data.byteLength);
    write16(view, cursor + 26, entry.name.byteLength);
    output.set(entry.name, cursor + 30);
    output.set(entry.data, cursor + 30 + entry.name.byteLength);
    cursor += 30 + entry.name.byteLength + entry.data.byteLength;
  }

  const centralOffset = cursor;
  for (const entry of prepared) {
    write32(view, cursor, 0x02014b50);
    write16(view, cursor + 4, 20);
    write16(view, cursor + 6, 20);
    write16(view, cursor + 8, 0x0800);
    write32(view, cursor + 16, entry.crc);
    write32(view, cursor + 20, entry.data.byteLength);
    write32(view, cursor + 24, entry.data.byteLength);
    write16(view, cursor + 28, entry.name.byteLength);
    write32(view, cursor + 42, entry.offset);
    output.set(entry.name, cursor + 46);
    cursor += 46 + entry.name.byteLength;
  }

  write32(view, cursor, 0x06054b50);
  write16(view, cursor + 8, prepared.length);
  write16(view, cursor + 10, prepared.length);
  write32(view, cursor + 12, centralSize);
  write32(view, cursor + 16, centralOffset);
  return new Blob([output], { type: "application/zip" });
}
