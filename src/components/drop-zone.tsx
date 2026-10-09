"use client";

import { ImagePlus } from "lucide-react";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { useI18n } from "@/i18n";
import { isSupportedImageInput } from "@/lib/image-input";

/** 拒绝提示停留时长：够读完一行字，又不至于在下一次投放时还挂着旧话 */
const REJECT_CLEAR_MS = 4000;

/**
 * 首屏右栏的投放区。
 *
 * 拖放只是增强：原生 file input 直接覆盖整个可见选择区域，
 * 点击不再依赖 label 转发，所以「必须拖拽」这件事在这里不成立
 * （WCAG 2.2 AA · Dragging Movements）。整块虚线区同时是拖放目标。
 *
 * 不支持的文件必须给反馈：静默过滤读起来像「网站坏了」。
 */
export function DropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const { t } = useI18n();
  const [dragOver, setDragOver] = useState(false);
  const [rejected, setRejected] = useState(0);
  const rejectTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rejectTimer.current !== null) window.clearTimeout(rejectTimer.current);
    };
  }, []);

  const accept = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    const images = files.filter(isSupportedImageInput);
    const skipped = files.length - images.length;

    if (skipped > 0) {
      setRejected(skipped);
      if (rejectTimer.current !== null) window.clearTimeout(rejectTimer.current);
      rejectTimer.current = window.setTimeout(() => setRejected(0), REJECT_CLEAR_MS);
    } else {
      setRejected(0);
    }

    onFiles(images);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setDragOver(false);
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    accept(event.dataTransfer.files);
  };

  return (
    <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <div
        className={`relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full px-7 text-center transition-colors focus-within:ring-4 focus-within:ring-ring/20 ${
          dragOver
            ? "border-primary bg-primary/[0.08]"
            : "bg-primary hover:bg-primary/90"
        }`}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          aria-label={t.controls.add}
          className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
          onChange={(event) => {
            accept(event.target.files);
            event.target.value = "";
          }}
        />
        <span className="mr-2 text-primary-foreground" aria-hidden="true">
          <ImagePlus className="size-4" />
        </span>
        <span className="text-sm font-semibold text-primary-foreground">
          {t.controls.add}
        </span>
      </div>

      {rejected > 0 && (
        <p role="status" className="mt-2 text-center text-xs text-destructive">
          {t.dropzone.rejected.replace("{n}", String(rejected))}
        </p>
      )}
    </div>
  );
}
