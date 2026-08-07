import type { Format } from "./store";

export type CompressRequest = {
  type: "compress";
  id: string;
  file: File;
  format: Format;
  quality: number;
  maxWidth: number;
};

export type CompressResponse =
  | { type: "done"; id: string; blob: Blob }
  | { type: "error"; id: string; reason: string };
