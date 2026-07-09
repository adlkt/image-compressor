import type { Lang } from "./locales";

export type { Lang } from "./locales";

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
  footerPrivacy: string;
  counter: string;
  privacyPage: {
    title: string;
    intro: string;
    sections: { title: string; content: string }[];
  };
  howItWorks: {
    title: string;
    steps: { title: string; desc: string }[];
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
};

export const translations: Record<Lang, Translations> = {
  zh: {
    title: "图片压缩",
    description: "纯浏览器端图片压缩 · 零上传 · 隐私安全",
    hero: "拖拽、粘贴或点击，即刻压缩",
    heroSub:
      "专为高分辨率截图优化。WebP / AVIF / PNG / JPEG，批量处理。所有处理在本地浏览器完成，图片不会被上传到任何服务器。",
    features: {
      privacy: {
        title: "隐私优先",
        desc: "所有处理在浏览器本地完成，图片永不离开你的设备。",
      },
      format: {
        title: "多格式支持",
        desc: "WebP / AVIF / PNG / JPEG。PNG 保留透明通道。AVIF 体积最小但编码较慢。",
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
    footer: "基于 Canvas API 构建 · 免费开源",
    footerPrivacy: "隐私政策",
    counter: "已压缩超过 1,234,567 张图片",
    privacyPage: {
      title: "隐私政策",
      intro:
        "最后更新：2026 年 6 月 20 日。本隐私政策说明 Image Compressor 如何处理你的数据。",
      sections: [
        {
          title: "我们不收集任何数据",
          content:
            "所有图片压缩处理完全在你的浏览器本地完成。图片不会被上传到任何服务器，我们也不存储、查看或传输你的任何图片。",
        },
        {
          title: "本地存储",
          content:
            "我们使用浏览器存储仅保存你的语言偏好（中文/英文/日文）和主题设置（浅色/深色）。这些信息只用于恢复你的界面偏好，不会被我们出售或用于追踪。",
        },
        {
          title: "广告与第三方服务",
          content:
            "我们可能在页面中展示广告（如 Google AdSense）。这些第三方广告商可能使用 Cookie 来提供相关广告。这些 Cookie 由广告商管理，不受我们控制。你可以在浏览器设置中管理或禁用 Cookie。",
        },
        {
          title: "分析工具",
          content:
            "我们可能使用隐私友好的分析工具（如 Plausible 或 Umami）来了解网站使用情况。这些工具不追踪个人用户，不设置 Cookie，所有数据匿名化处理。",
        },
        {
          title: "联系我们",
          content:
            "如果你对隐私政策有任何疑问，请通过 GitHub Issues 联系我们。",
        },
      ],
    },
    howItWorks: {
      title: "如何使用",
      steps: [
        { title: "添加图片", desc: "拖拽、粘贴截图或点击上传" },
        { title: "调整设置", desc: "选择输出格式、质量和最大宽度" },
        { title: "下载结果", desc: "单张下载或打包下载" },
      ],
    },
    faq: {
      title: "常见问题",
      items: [
        {
          q: "图片会上传到服务器吗？",
          a: "不会。所有压缩处理完全在你的浏览器本地完成。图片不会离开你的设备，我们无法访问你的任何图片。你甚至可以断开网络连接后继续使用。",
        },
        {
          q: "支持哪些图片格式？",
          a: "输入支持所有浏览器能打开的图片格式（JPG、PNG、GIF、WebP、AVIF、BMP 等）。输出可选择 WebP、AVIF、PNG 或 JPEG。",
        },
        {
          q: "WebP 和 AVIF 有什么区别？",
          a: "AVIF 压缩率更高（同质量下体积比 WebP 小 20-30%），但编码速度较慢。WebP 兼容性更好，编码更快。日常使用推荐 WebP，追求极限压缩选 AVIF。",
        },
        {
          q: "PNG 会保留透明背景吗？",
          a: "会。PNG 格式完整保留 alpha 透明通道。JPEG 不支持透明，WebP 和 AVIF 也支持透明。",
        },
        {
          q: "压缩会损失画质吗？",
          a: "调整质量滑块可以控制画质。WebP/JPEG/AVIF 是有损压缩（但 90% 以上质量肉眼几乎看不出区别）。PNG 是无损压缩，不损失画质但文件较大。",
        },
      ],
    },
  },
  en: {
    title: "Image Compressor",
    description: "Client-side image compression · Zero upload · Privacy first",
    hero: "Drag, paste, or click to compress",
    heroSub:
      "Optimized for high-res screenshots. WebP / AVIF / PNG / JPEG, batch processing. All compression happens in your browser — nothing uploaded.",
    features: {
      privacy: {
        title: "Privacy First",
        desc: "All processing is done locally. Images never leave your device.",
      },
      format: {
        title: "Multi-Format",
        desc: "WebP / AVIF / PNG / JPEG. PNG preserves alpha channel. AVIF offers smallest size.",
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
    footerPrivacy: "Privacy Policy",
    counter: "Over 1,234,567 images compressed",
    privacyPage: {
      title: "Privacy Policy",
      intro:
        "Last updated: June 20, 2026. This privacy policy explains how Image Compressor handles your data.",
      sections: [
        {
          title: "We Do Not Collect Any Data",
          content:
            "All image compression is done entirely within your browser. Images are never uploaded to any server. We do not store, view, or transmit any of your images.",
        },
        {
          title: "Local Storage",
          content:
            "We use browser storage only to save your language preference (Chinese/English/Japanese) and theme setting (light/dark). This data is used to restore your UI preferences and is never sold or used for tracking.",
        },
        {
          title: "Advertising & Third Parties",
          content:
            "We may display advertisements (such as Google AdSense) on the page. These third-party advertisers may use cookies to serve relevant ads. These cookies are managed by the advertiser, not by us. You can manage or disable cookies in your browser settings.",
        },
        {
          title: "Analytics",
          content:
            "We may use privacy-friendly analytics tools (such as Plausible or Umami) to understand site usage. These tools do not track individual users, do not set cookies, and all data is anonymized.",
        },
        {
          title: "Contact Us",
          content:
            "If you have any questions about this privacy policy, please contact us via GitHub Issues.",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      steps: [
        {
          title: "Add images",
          desc: "Drag & drop, paste from clipboard, or click to upload",
        },
        {
          title: "Adjust settings",
          desc: "Choose format, quality, and max width",
        },
        { title: "Download", desc: "Save individually or as a batch" },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          q: "Are my images uploaded to a server?",
          a: "No. All compression happens entirely in your browser. Images never leave your device. You can even disconnect from the internet and keep using the tool.",
        },
        {
          q: "Which formats are supported?",
          a: "Input supports all image formats browsers can open (JPG, PNG, GIF, WebP, AVIF, BMP, etc.). Output choices: WebP, AVIF, PNG, or JPEG.",
        },
        {
          q: "What's the difference between WebP and AVIF?",
          a: "AVIF compresses better (20-30% smaller than WebP at equal quality), but encodes slower. WebP has wider compatibility and faster encoding. Use WebP for daily use, AVIF for smallest file size.",
        },
        {
          q: "Does PNG preserve transparency?",
          a: "Yes. PNG fully preserves the alpha channel. JPEG does not support transparency. WebP and AVIF also support transparency.",
        },
        {
          q: "Does compression reduce image quality?",
          a: "Adjust the quality slider to control the trade-off. WebP/JPEG/AVIF are lossy (but 90%+ quality is nearly indistinguishable). PNG is lossless — no quality loss but larger files.",
        },
      ],
    },
  },
  ja: {
    title: "画像圧縮",
    description: "ブラウザ内で画像圧縮 · アップロード不要 · プライバシー重視",
    hero: "ドラッグ＆ドロップでまとめて圧縮",
    heroSub:
      "高解像度スクリーンショットに最適化。WebP / AVIF / PNG / JPEG、一括処理対応。すべてブラウザ内で処理され、画像は一切アップロードされません。",
    features: {
      privacy: {
        title: "プライバシー第一",
        desc: "すべての処理はブラウザ内で行われ、画像が外部に出ることはありません。",
      },
      format: {
        title: "マルチフォーマット",
        desc: "WebP / AVIF / PNG / JPEG。PNG はアルファチャンネル保持。AVIF は最小サイズ。",
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
    footerPrivacy: "プライバシーポリシー",
    counter: "1,234,567 枚以上の画像を圧縮",
    privacyPage: {
      title: "プライバシーポリシー",
      intro:
        "最終更新日: 2026年6月20日。このプライバシーポリシーは、Image Compressor がデータをどのように取り扱うかを説明します。",
      sections: [
        {
          title: "データ収集は一切行いません",
          content:
            "すべての画像圧縮処理は完全にブラウザ内で行われます。画像がサーバーにアップロードされることは一切ありません。お客様の画像を保存、表示、送信することはありません。",
        },
        {
          title: "ローカルストレージ",
          content:
            "ブラウザストレージは、言語設定（中国語/英語/日本語）とテーマ設定（ライト/ダーク）の保存にのみ使用します。このデータは UI 設定の復元にのみ使われ、販売や追跡には使用しません。",
        },
        {
          title: "広告とサードパーティ",
          content:
            "ページ内に広告（Google AdSense など）を表示する場合があります。これらのサードパーティ広告主は、関連広告を配信するために Cookie を使用することがあります。これらの Cookie は広告主によって管理され、当方の管理下にはありません。ブラウザ設定で Cookie を管理または無効化できます。",
        },
        {
          title: "分析ツール",
          content:
            "サイトの利用状況を把握するために、プライバシーに配慮した分析ツール（Plausible や Umami など）を使用する場合があります。これらのツールは個人ユーザーを追跡せず、Cookie を設定せず、すべてのデータは匿名化されます。",
        },
        {
          title: "お問い合わせ",
          content:
            "プライバシーポリシーについてご質問がある場合は、GitHub Issues からお問い合わせください。",
        },
      ],
    },
    howItWorks: {
      title: "使い方",
      steps: [
        {
          title: "画像を追加",
          desc: "ドラッグ＆ドロップ、貼り付け、またはクリックでアップロード",
        },
        { title: "設定を調整", desc: "フォーマット、品質、最大幅を選択" },
        { title: "ダウンロード", desc: "個別または一括ダウンロード" },
      ],
    },
    faq: {
      title: "よくある質問",
      items: [
        {
          q: "画像はサーバーにアップロードされますか？",
          a: "いいえ。すべての圧縮処理は完全にブラウザ内で行われます。画像がデバイスから外部に出ることはありません。インターネット接続を切断しても引き続き使用できます。",
        },
        {
          q: "どのフォーマットに対応していますか？",
          a: "入力はブラウザが開けるすべての画像形式（JPG、PNG、GIF、WebP、AVIF、BMP など）に対応。出力は WebP、AVIF、PNG、JPEG から選択可能です。",
        },
        {
          q: "WebP と AVIF の違いは？",
          a: "AVIF は圧縮率が高く（同じ品質で WebP より 20-30% 小さい）、エンコードが遅めです。WebP は互換性が高くエンコードが高速。日常使用は WebP、最小サイズを求めるなら AVIF。",
        },
        {
          q: "PNG は透明背景を保持しますか？",
          a: "はい。PNG はアルファ透明チャンネルを完全に保持します。JPEG は透明非対応。WebP と AVIF も透明対応です。",
        },
        {
          q: "圧縮で画質は劣化しますか？",
          a: "品質スライダーで調整できます。WebP/JPEG/AVIF は非可逆圧縮（ただし 90% 以上なら肉眼ではほぼ区別できません）。PNG は可逆圧縮で画質劣化なし、ファイルサイズは大きめです。",
        },
      ],
    },
  },
};
