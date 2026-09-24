import type { Lang } from "./locales";

export type { Lang } from "./locales";

export type Translations = {
  title: string;
  description: string;
  /** 铭牌上的一句话：这台机器是干什么的 */
  tagline: string;
  /** 关于这一段：说清它做什么、不做什么 */
  about: string;
  features: {
    privacy: { title: string; desc: string };
    format: { title: string; desc: string };
    realtime: { title: string; desc: string };
  };
  dropzone: {
    title: string;
    paste: string;
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
    processing: string;
    allDone: string;
    failedItems: string;
    retry: string;
    targetSize: string;
    targetSizeHint: string;
    targetSizePng: string;
    targetMet: string;
    targetMissed: string;
    batchNaming: string;
    namingTemplate: string;
    namingHint: string;
    filenameExample: string;
    exportPreparing: string;
    exportError: string;
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
  footerTerms: string;
  footerContact: string;
  gauge: {
    range: string;
    idle: string;
  };
  privacyPage: {
    title: string;
    intro: string;
    sections: { title: string; content: string }[];
  };
  termsPage: {
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
    description: "HEIC / HEIF / JPEG / PNG / WebP",
    tagline: "压缩、改尺寸、换格式，全程在浏览器里完成",
    about:
      "iPhone 的 HEIC 照片和 macOS 的大截图都能直接拖进来，压缩、改尺寸、换格式一次处理完。所有计算都在这台设备上完成——图片不会离开浏览器，也没有可以上传的地方。",
    features: {
      privacy: {
        title: "隐私优先",
        desc: "本地处理，不上传。",
      },
      format: {
        title: "多格式支持",
        desc: "支持 HEIC / HEIF 输入，输出 WebP / PNG / JPEG。",
      },
      realtime: {
        title: "实时预览",
        desc: "拖动质量滑块，所有图片即时重新压缩，效果立即可见。",
      },
    },
    dropzone: {
      title: "把图片拖进来",
      paste: "拖进来，或者直接粘贴截图",
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
      add: "选择图片",
      processing: "压缩中",
      allDone: "已完成",
      failedItems: "失败 {count} 项",
      retry: "点击重试",
      targetSize: "目标大小",
      targetSizeHint: "留空则只按质量压缩，范围 20–10240 KB",
      targetSizePng: "PNG 不支持按目标大小寻优",
      targetMet: "已达到大小目标",
      targetMissed: "已用最低质量，仍高于目标",
      batchNaming: "批量命名",
      namingTemplate: "文件名模板",
      namingHint: "可用：{name} 原名、{n} 序号、{width}、{height}",
      filenameExample: "实时示例",
      exportPreparing: "正在打包",
      exportError: "打包失败，请重试",
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
    footer: "纯本地处理 · 图片不会上传 · 免费使用",
    footerPrivacy: "隐私政策",
    footerTerms: "服务条款",
    footerContact: "联系我们",
    gauge: {
      range: "量程",
      idle: "把图片放进下面的进料口，这里会显示量到的体积。",
    },
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
            "我们使用浏览器存储保存语言、主题和压缩默认值。这些信息只用于恢复你的设置，不包含图片内容，也不会被出售或用于广告追踪。",
        },
        {
          title: "广告与第三方服务",
          content:
            "当前版本不展示广告，也不接入第三方广告追踪服务。如果未来发生变化，我们会先更新本政策并明确说明。",
        },
        {
          title: "分析工具",
          content:
            "我们可能使用隐私友好的分析工具（如 Plausible 或 Umami）来了解网站使用情况。这些工具不追踪个人用户，不设置 Cookie，所有数据匿名化处理。",
        },
        {
          title: "联系我们",
          content:
            "如果你对隐私政策或本服务有任何疑问，请通过邮箱 a17637040895@gmail.com 或 GitHub Issues（https://github.com/adlkt/image-compressor/issues）联系我们。",
        },
      ],
    },
    termsPage: {
      title: "服务条款",
      intro: "最后更新：2026 年 9 月 8 日。使用本网站即表示你同意以下条款。",
      sections: [
        {
          title: "服务说明",
          content:
            "Image Compressor 提供浏览器端图片压缩与格式转换工具。处理能力取决于设备内存和浏览器限制。",
        },
        {
          title: "使用方式",
          content:
            "本工具当前免费使用，不提供付费套餐、订阅或许可证。请仅处理你有权使用的图片。",
        },
        {
          title: "问题反馈",
          content:
            "如遇功能问题或对使用条款有疑问，请通过下方联系方式与我们沟通。",
        },
        {
          title: "知识产权",
          content:
            "Image Compressor 的名称、界面与代码受知识产权法律保护。你使用本工具处理的图片归你所有，我们不主张任何权利。",
        },
        {
          title: "免责声明与责任限制",
          content:
            "本服务按「现状」提供。虽然所有压缩处理均在你的浏览器本地完成、图片不会上传，我们仍不对因使用本工具导致的任何数据损失承担责任。批量处理重要文件前请自行备份。",
        },
        {
          title: "条款变更",
          content:
            "我们可能不时更新这些条款。变更后将在本页面发布并更新日期。变更后继续使用本服务即视为接受更新后的条款。",
        },
        {
          title: "联系方式",
          content:
            "如有任何疑问，请通过邮箱 a17637040895@gmail.com 或 GitHub Issues（https://github.com/adlkt/image-compressor/issues）联系我们。",
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
          a: "输入支持 iPhone HEIC/HEIF 和浏览器能够解码的静态图片格式。输出可选择 WebP、PNG 或 JPEG。动画图片会按静态图片处理。",
        },
        {
          q: "为什么暂不提供 AVIF 输出？",
          a: "浏览器可以显示 AVIF，并不代表能够可靠地编码 AVIF。我们会在编码能力经过验证后再提供，避免生成格式错误的文件。",
        },
        {
          q: "PNG 会保留透明背景吗？",
          a: "会。PNG 格式完整保留 alpha 透明通道。JPEG 不支持透明，WebP 支持透明。",
        },
        {
          q: "压缩会损失画质吗？",
          a: "调整质量滑块可以控制 WebP/JPEG 的画质与体积。PNG 输出不使用质量滑块，文件通常更大。",
        },
      ],
    },
  },
  en: {
    title: "Image Compressor",
    description: "HEIC / HEIF / JPEG / PNG / WebP",
    tagline: "Compress, resize, and convert — all inside your browser",
    about:
      "Drop in iPhone HEIC photos and oversized macOS screenshots, then compress, resize, and convert them in one pass. Every calculation runs on this device: your images never leave the browser, and there is nowhere for them to be uploaded.",
    features: {
      privacy: {
        title: "Privacy First",
        desc: "Processed locally. Never uploaded.",
      },
      format: {
        title: "Multi-Format",
        desc: "HEIC / HEIF input with WebP / PNG / JPEG output.",
      },
      realtime: {
        title: "Live Preview",
        desc: "Adjust quality and see results instantly across all images.",
      },
    },
    dropzone: {
      title: "Drop images here",
      paste: "Drop them in, or paste a screenshot",
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
      add: "Choose images",
      processing: "Processing",
      allDone: "All done",
      failedItems: "{count} failed",
      retry: "Click to retry",
      targetSize: "Target size",
      targetSizeHint: "Leave blank to use quality only · 20–10240 KB",
      targetSizePng: "Target-size optimization is unavailable for PNG",
      targetMet: "Size target met",
      targetMissed: "Still above target at minimum quality",
      batchNaming: "Batch naming",
      namingTemplate: "Filename template",
      namingHint: "Tokens: {name}, {n}, {width}, {height}",
      filenameExample: "Live example",
      exportPreparing: "Preparing package",
      exportError: "Package creation failed. Try again.",
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
    footer: "100% local processing · Images never upload · Free to use",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Service",
    footerContact: "Contact Us",
    gauge: {
      range: "Range",
      idle: "Feed an image in below and this scale will show what it measures.",
    },
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
            "Browser storage keeps your language, theme, and compression defaults. This only restores your settings, contains no image content, and is not sold or used for advertising tracking.",
        },
        {
          title: "Advertising & Third Parties",
          content:
            "The current version shows no advertising and uses no third-party advertising trackers. If that changes, we will update this policy and explain it clearly first.",
        },
        {
          title: "Analytics",
          content:
            "We may use privacy-friendly analytics tools (such as Plausible or Umami) to understand site usage. These tools do not track individual users, do not set cookies, and all data is anonymized.",
        },
        {
          title: "Contact Us",
          content:
            "If you have any questions about this privacy policy or our service, please contact us at a17637040895@gmail.com or via GitHub Issues (https://github.com/adlkt/image-compressor/issues).",
        },
      ],
    },
    termsPage: {
      title: "Terms of Service",
      intro:
        "Last updated: September 8, 2026. By using this website, you agree to the following terms.",
      sections: [
        {
          title: "About the Service",
          content:
            "Image Compressor provides browser-based image compression and format conversion. Practical capacity depends on device memory and browser limits.",
        },
        {
          title: "Use of the Service",
          content:
            "The tool is currently free to use and does not offer paid plans, subscriptions, or licenses. Only process images you are authorized to use.",
        },
        {
          title: "Support",
          content:
            "If you experience a functional issue or have questions about these terms, contact us using the details below.",
        },
        {
          title: "Intellectual Property",
          content:
            "The name, interface, and code of Image Compressor are protected by intellectual property law. Images you process with this tool belong to you; we claim no rights over them.",
        },
        {
          title: "Disclaimer & Limitation of Liability",
          content:
            'The service is provided "as is". Although all compression happens locally in your browser and images are never uploaded, we are not liable for any data loss resulting from use of this tool. Please back up important files before batch processing.',
        },
        {
          title: "Changes to These Terms",
          content:
            "We may update these terms from time to time. Changes will be posted on this page with an updated date. Continued use of the service after changes constitutes acceptance of the updated terms.",
        },
        {
          title: "Contact Us",
          content:
            "For any questions, please contact us at a17637040895@gmail.com or via GitHub Issues (https://github.com/adlkt/image-compressor/issues).",
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
          a: "Input supports iPhone HEIC/HEIF and static image formats your browser can decode. Output choices are WebP, PNG, or JPEG. Animated images are processed as still images.",
        },
        {
          q: "Why isn't AVIF output available yet?",
          a: "A browser may display AVIF without being able to encode it reliably. We will only offer AVIF after the encoder is verified, so downloads always match their stated format.",
        },
        {
          q: "Does PNG preserve transparency?",
          a: "Yes. PNG fully preserves the alpha channel. JPEG does not support transparency, while WebP does.",
        },
        {
          q: "Does compression reduce image quality?",
          a: "Adjust the quality slider to control WebP/JPEG quality and size. PNG output does not use the quality slider and is usually larger.",
        },
      ],
    },
  },
  ja: {
    title: "画像圧縮",
    description: "HEIC / HEIF / JPEG / PNG / WebP",
    tagline: "圧縮・リサイズ・形式変換を、ブラウザだけで",
    about:
      "iPhone の HEIC 写真も macOS の大きなスクリーンショットもそのまま追加でき、圧縮・リサイズ・形式変換を一度に処理します。計算はすべてこのデバイス上で行われ、画像がブラウザの外に出ることはありません。",
    features: {
      privacy: {
        title: "プライバシー第一",
        desc: "端末内で処理。アップロードなし。",
      },
      format: {
        title: "マルチフォーマット",
        desc: "HEIC / HEIF 入力、WebP / PNG / JPEG 出力に対応。",
      },
      realtime: {
        title: "リアルタイムプレビュー",
        desc: "品質スライダーの調整で、すべての画像が即座に再圧縮されます。",
      },
    },
    dropzone: {
      title: "画像をここにドロップ",
      paste: "ドロップ、またはスクリーンショットを貼り付け",
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
      add: "画像を選択",
      processing: "処理中",
      allDone: "完了",
      failedItems: "{count} 件失敗",
      retry: "クリックで再試行",
      targetSize: "目標サイズ",
      targetSizeHint: "空欄は品質のみ · 20〜10240 KB",
      targetSizePng: "PNG は目標サイズ最適化に対応していません",
      targetMet: "サイズ目標を達成",
      targetMissed: "最低品質でも目標を超えています",
      batchNaming: "一括命名",
      namingTemplate: "ファイル名テンプレート",
      namingHint: "使用可能：{name}、{n}、{width}、{height}",
      filenameExample: "プレビュー",
      exportPreparing: "パッケージ作成中",
      exportError: "パッケージ作成に失敗しました",
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
    footer: "完全ローカル処理 · 画像はアップロードされません · 無料で利用可能",
    footerPrivacy: "プライバシーポリシー",
    footerTerms: "利用規約",
    footerContact: "お問い合わせ",
    gauge: {
      range: "レンジ",
      idle: "下の投入口に画像を入れると、ここに計測結果が表示されます。",
    },
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
            "ブラウザストレージには言語、テーマ、圧縮の初期設定を保存します。設定の復元にのみ使われ、画像内容は含まず、販売や広告追跡には使用しません。",
        },
        {
          title: "広告とサードパーティ",
          content:
            "現在のバージョンでは広告を表示せず、第三者の広告トラッカーも使用しません。将来変更する場合は、事前に本ポリシーを更新し、明確に説明します。",
        },
        {
          title: "分析ツール",
          content:
            "サイトの利用状況を把握するために、プライバシーに配慮した分析ツール（Plausible や Umami など）を使用する場合があります。これらのツールは個人ユーザーを追跡せず、Cookie を設定せず、すべてのデータは匿名化されます。",
        },
        {
          title: "お問い合わせ",
          content:
            "プライバシーポリシーや本サービスについてご質問がある場合は、メール（a17637040895@gmail.com）または GitHub Issues（https://github.com/adlkt/image-compressor/issues）からお問い合わせください。",
        },
      ],
    },
    termsPage: {
      title: "利用規約",
      intro:
        "最終更新日: 2026年9月8日。本サイトをご利用いただくことで、以下の規約に同意したものとみなされます。",
      sections: [
        {
          title: "サービスについて",
          content:
            "Image Compressor はブラウザ内で動作する画像圧縮・形式変換ツールです。処理容量は端末のメモリとブラウザの制限に依存します。",
        },
        {
          title: "利用方法",
          content:
            "このツールは現在無料で利用でき、有料プラン、サブスクリプション、ライセンスは提供していません。使用権限のある画像のみ処理してください。",
        },
        {
          title: "サポート",
          content:
            "機能上の問題や利用規約についてご質問がある場合は、下記の連絡先までお問い合わせください。",
        },
        {
          title: "知的財産権",
          content:
            "Image Compressor の名称・インターフェース・コードは知的財産法により保護されています。本ツールで処理された画像の権利はすべてユーザーに帰属し、当方が主張することはありません。",
        },
        {
          title: "免責事項",
          content:
            "本サービスは「現状有姿」で提供されます。すべての圧縮処理はブラウザ内で完結し、画像がアップロードされることはありませんが、本ツールの利用によって生じたデータの損失について当方は責任を負いません。重要なファイルを一括処理する前に、必ずバックアップをお取りください。",
        },
        {
          title: "規約の変更",
          content:
            "本規約は随時更新される場合があります。変更後は本ページに掲載し、日付を更新します。変更後も本サービスを継続利用された場合、更新後の規約に同意したものとみなされます。",
        },
        {
          title: "お問い合わせ",
          content:
            "ご不明な点があれば、メール（a17637040895@gmail.com）または GitHub Issues（https://github.com/adlkt/image-compressor/issues）までご連絡ください。",
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
          a: "iPhone の HEIC/HEIF とブラウザがデコードできる静止画像形式に対応。出力は WebP、PNG、JPEG から選択できます。アニメーション画像は静止画として処理されます。",
        },
        {
          q: "AVIF 出力がまだ利用できないのはなぜですか？",
          a: "ブラウザが AVIF を表示できても、安定してエンコードできるとは限りません。ダウンロード形式の正確性を保証できるよう、検証後に提供します。",
        },
        {
          q: "PNG は透明背景を保持しますか？",
          a: "はい。PNG はアルファ透明チャンネルを完全に保持します。JPEG は透明非対応で、WebP は透明対応です。",
        },
        {
          q: "圧縮で画質は劣化しますか？",
          a: "品質スライダーで WebP/JPEG の画質とサイズを調整できます。PNG 出力では品質スライダーを使用せず、通常はサイズが大きくなります。",
        },
      ],
    },
  },
};
