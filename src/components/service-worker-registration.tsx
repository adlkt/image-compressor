"use client";

import { useEffect } from "react";
import { BASE_PATH } from "@/lib/base-path";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    // sw.js 是 public/ 下的静态文件，Next 不会给它补 basePath。
    void navigator.serviceWorker.register(`${BASE_PATH}/sw.js`, {
      updateViaCache: "none",
    });
  }, []);

  return null;
}
