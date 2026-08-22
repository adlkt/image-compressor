import type { Format } from "./store";

export type CompressRequest = {
  type: "compress";
  id: string;
  requestId: number;
  file: File;
  format: Format;
  quality: number;
  maxWidth: number;
};

export type CompressResponse =
  | { type: "done"; id: string; requestId: number; blob: Blob }
  | { type: "error"; id: string; requestId: number; reason: string };
