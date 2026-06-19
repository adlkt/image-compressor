export type Lang = "zh" | "en" | "ja";

export type Translations = {
  title: string;
  description: string;
  hero: string;
  heroSub: string;
  features: {
    privacy: { title: string; desc: string };
    format: { title: string; desc: string };
    realtime: { title: string; desc: string };
  };
  nav: {
    pricing: string;
    docs: string;
    api: string;
    login: string;
  };
  dropzone: {
    title: string;
    subtitle: string;
  };
  controls: {
    presets: string;
    custom: string;
    format: string;
    quality: string;
    maxWidth: string;
    original: string;
    noLimit: string;
    remove: string;
    clearAll: string;
    compressed: string;
    wait: string;
    compressing: string;
    files: string;
    add: string;
  };
  presets: {
    presetWeb: string;
    presetWebDesc: string;
    presetSocial: string;
    presetSocialDesc: string;
    presetEcommerce: string;
    presetEcommerceDesc: string;
    presetMax: string;
    presetMaxDesc: string;
  };
  download: string;
  downloadAll: string;
  downloadZip: string;
  downloadIndividual: string;
  summary: {
    totalSaved: string;
    totalFiles: string;
    totalOriginal: string;
    totalCompressed: string;
  };
  theme: { light: string; dark: string; auto: string };
  lang: string;
  footer: string;
  counter: string;
};

export const translations: Record<Lang, Translations> = {
  zh: {
    title: "图片压缩",
    description: "纯浏览器端图片压缩 · 零上传 · 隐私安全",
    hero: "拖拽、粘贴或点击，即刻压缩",
    heroSub:
      "专为高分辨率截图优化。WebP 默认格式，批量处理。所有处理在本地浏览器完成，图片不会被上传到任何服务器。",
    features: {
      privacy: {
        title: "隐私优先",
        desc: "所有处理在浏览器本地完成，图片永不离开你的设备。",
      },
      format: {
        title: "多格式支持",
        desc: "默认 WebP（体积更小），可选 JPEG 兼容老设备。",
      },
      realtime: {
        title: "实时预览",
        desc: "拖动质量滑块，所有图片即时重新压缩，效果立即可见。",
      },
    },
    nav: {
      pricing: "定价",
      docs: "文档",
      api: "API",
      login: "登录",
    },
    dropzone: {
      title: "拖拽图片到此处",
      subtitle: "或点击选择 / 粘贴截图 (Ctrl+V) · 支持批量",
    },
    controls: {
      presets: "预设",
      custom: "自定义",
      format: "格式",
      quality: "质量",
      maxWidth: "最大宽度",
      original: "原始",
      noLimit: "不限制",
      remove: "移除",
      clearAll: "清空全部",
      compressed: "压缩后",
      wait: "选择图片查看预览",
      compressing: "压缩中",
      files: "个文件",
      add: "添加",
    },
    presets: {
      presetWeb: "Web 优化",
      presetWebDesc: "WebP 80% · 1920px",
      presetSocial: "社交媒体",
      presetSocialDesc: "JPEG 85% · 1200px",
      presetEcommerce: "电商商品图",
      presetEcommerceDesc: "WebP 85% · 2048px",
      presetMax: "最佳质量",
      presetMaxDesc: "WebP 95% · 原始尺寸",
    },
    download: "下载",
    downloadAll: "下载全部",
    downloadZip: "下载 ZIP",
    downloadIndividual: "逐张下载",
    summary: {
      totalSaved: "总计节省",
      totalFiles: "文件数",
      totalOriginal: "原始大小",
      totalCompressed: "压缩后大小",
    },
    theme: { light: "浅色", dark: "深色", auto: "系统" },
    lang: "语言",
    footer: "基于 Canvas API 构建 · 开源免费",
    counter: "已压缩超过 1,234,567 张图片",
  },
  en: {
    title: "Image Compressor",
    description:
      "Client-side image compression · Zero upload · Privacy first",
    hero: "Drag, paste, or click to compress",
    heroSub:
      "Optimized for high-res screenshots. WebP by default, batch processing. All compression happens in your browser — nothing uploaded.",
    features: {
      privacy: {
        title: "Privacy First",
        desc: "All processing is done locally. Images never leave your device.",
      },
      format: {
        title: "Multi-Format",
        desc: "WebP by default, JPEG for legacy compatibility.",
      },
      realtime: {
        title: "Live Preview",
        desc: "Adjust quality and see results instantly across all images.",
      },
    },
    nav: {
      pricing: "Pricing",
      docs: "Docs",
      api: "API",
      login: "Login",
    },
    dropzone: {
      title: "Drop your images here",
      subtitle: "or click to browse / paste (Ctrl+V) · batch supported",
    },
    controls: {
      presets: "Presets",
      custom: "Custom",
      format: "Format",
      quality: "Quality",
      maxWidth: "Max width",
      original: "Original",
      noLimit: "No limit",
      remove: "Remove",
      clearAll: "Clear all",
      compressed: "Compressed",
      wait: "Select an image to preview",
      compressing: "Compressing",
      files: "files",
      add: "Add",
    },
    presets: {
      presetWeb: "Web optimized",
      presetWebDesc: "WebP 80% · 1920px",
      presetSocial: "Social media",
      presetSocialDesc: "JPEG 85% · 1200px",
      presetEcommerce: "E-commerce",
      presetEcommerceDesc: "WebP 85% · 2048px",
      presetMax: "Best quality",
      presetMaxDesc: "WebP 95% · original size",
    },
    download: "Download",
    downloadAll: "Download all",
    downloadZip: "Download ZIP",
    downloadIndividual: "Download individually",
    summary: {
      totalSaved: "Total saved",
      totalFiles: "Files",
      totalOriginal: "Original",
      totalCompressed: "Compressed",
    },
    theme: { light: "Light", dark: "Dark", auto: "System" },
    lang: "Language",
    footer: "Built with Canvas API · Free & open source",
    counter: "Over 1,234,567 images compressed",
  },
  ja: {
    title: "画像圧縮",
    description:
      "ブラウザ内で画像圧縮 · アップロード不要 · プライバシー重視",
    hero: "ドラッグ＆ドロップでまとめて圧縮",
    heroSub:
      "高解像度スクリーンショットに最適化。WebP 標準、一括処理対応。すべてブラウザ内で処理され、画像は一切アップロードされません。",
    features: {
      privacy: {
        title: "プライバシー第一",
        desc: "すべての処理はブラウザ内で行われ、画像が外部に出ることはありません。",
      },
      format: {
        title: "マルチフォーマット",
        desc: "デフォルトは WebP、JPEG も選択可能。",
      },
      realtime: {
        title: "リアルタイムプレビュー",
        desc: "品質スライダーの調整で、すべての画像が即座に再圧縮されます。",
      },
    },
    nav: {
      pricing: "料金",
      docs: "ドキュメント",
      api: "API",
      login: "ログイン",
    },
    dropzone: {
      title: "画像をここにドロップ",
      subtitle: "またはクリック / 貼り付け (Ctrl+V) · 一括対応",
    },
    controls: {
      presets: "プリセット",
      custom: "カスタム",
      format: "フォーマット",
      quality: "品質",
      maxWidth: "最大幅",
      original: "元サイズ",
      noLimit: "制限なし",
      remove: "削除",
      clearAll: "すべて削除",
      compressed: "圧縮後",
      wait: "画像を選択してプレビュー",
      compressing: "圧縮中",
      files: "ファイル",
      add: "追加",
    },
    presets: {
      presetWeb: "ウェブ最適化",
      presetWebDesc: "WebP 80% · 1920px",
      presetSocial: "SNS用",
      presetSocialDesc: "JPEG 85% · 1200px",
      presetEcommerce: "EC商品画像",
      presetEcommerceDesc: "WebP 85% · 2048px",
      presetMax: "最高品質",
      presetMaxDesc: "WebP 95% · 元サイズ",
    },
    download: "ダウンロード",
    downloadAll: "すべてダウンロード",
    downloadZip: "ZIPでダウンロード",
    downloadIndividual: "個別にダウンロード",
    summary: {
      totalSaved: "合計削減",
      totalFiles: "ファイル数",
      totalOriginal: "元サイズ",
      totalCompressed: "圧縮後",
    },
    theme: { light: "ライト", dark: "ダーク", auto: "システム" },
    lang: "言語",
    footer: "Canvas API で構築 · 無料 & オープンソース",
    counter: "1,234,567 枚以上の画像を圧縮",
  },
};
