import type { Format } from "./store";

export type CompressRequest = {
  type: "compress";
  id: string;
  requestId: number;
  file: File;
  format: Format;
  quality: number;
  maxWidth: number;
  targetBytes: number | null;
};

export type CompressResponse =
  | {
      type: "done";
      id: string;
      requestId: number;
      blob: Blob;
      previewBlob: Blob | null;
      sourceWidth: number;
      sourceHeight: number;
      outputQuality: number | null;
      targetMet: boolean | null;
    }
  | { type: "error"; id: string; requestId: number; reason: string };
