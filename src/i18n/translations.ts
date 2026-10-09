import type { Lang } from "./locales";

export type { Lang } from "./locales";

export type Translations = {
  title: string;
  /** 首屏：一句可验证的主张 */
  hero: {
    claim: string;
    /** 示例图片入口的可见标签 */
    samples: string;
    /** 示例图的替换文本，顺序与组件里 SAMPLES 一致 */
    sampleLabels: string[];
    /** 点明示例图本身就是本工具的输出 */
    samplesNote: string;
    sampleError: string;
  };
  /** 首屏下方：一次真实压缩的读数与测量条件 */
  measure: {
    title: string;
    sample: string;
    original: string;
    output: string;
    elapsed: string;
    /** 环境与参数各摊成一组规格格，不拼成一句元信息串 */
    environment: string;
    browser: string;
    os: string;
    params: string;
    preset: string;
    format: string;
    quality: string;
    maxEdge: string;
    target: string;
    date: string;
  };
  /** 怎么用：无序列表，不是步骤条 */
  howto: {
    title: string;
    items: string[];
  };
  dropzone: {
    /** 拖入/选择了不被支持的文件时的行内提示；{n} 是被忽略的文件数 */
    rejected: string;
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
    clearAllConfirm: string;
    discardBatchConfirm: string;
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
    /** 原图本来就低于目标：达标是原图的事实，不是这次压缩的成果 */
    targetAlreadyMet: string;
    batchNaming: string;
    namingTemplate: string;
    namingHint: string;
    filenameExample: string;
    exportPreparing: string;
    exportError: string;
    /** 逐项细调的折叠标题 */
    fineTune: string;
    /** 预设规格格：最大宽度不受限 */
    originalSize: string;
    /** 预设规格格：不设目标大小 */
    noTarget: string;
  };
  presets: {
    presetWeb: string;
    presetSocial: string;
    presetEcommerce: string;
    presetMax: string;
    recommended: string;
    descriptions: Record<"web" | "social" | "ecommerce" | "quality", string>;
  };
  download: string;
  downloadAll: string;
  downloadZip: string;
  downloadIndividual: string;
  summary: {
    /** 批次体积变化：与队列行、预览表头同一套符号——减号＝变小 */
    totalChange: string;
    totalFiles: string;
    totalOriginal: string;
    totalCompressed: string;
  };
  theme: { light: string; dark: string; auto: string; switchTo: string };
  lang: string;
  /** 页脚的几句主张，逐句列出，不用中圆点连成一句 */
  footerClaims: string[];
  footerPrivacy: string;
  footerTerms: string;
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
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
};

export const translations: Record<Lang, Translations> = {
  zh: {
    title: "图片压缩",
    hero: {
      claim: "图片不上传，压缩在你的浏览器里跑完。",
      samples: "选择一张示例图",
      sampleLabels: ["云层航拍照片", "沙漠航拍照片"],
      samplesNote: "示例图由本工具压缩生成。",
      sampleError: "示例图加载失败，请选择你自己的图片。",
    },
    measure: {
      title: "真实测量",
      sample: "示例照片",
      original: "原图",
      output: "输出",
      elapsed: "耗时",
      environment: "环境",
      browser: "浏览器",
      os: "操作系统",
      params: "参数",
      preset: "预设",
      format: "格式",
      quality: "质量",
      maxEdge: "最长边",
      target: "目标",
      date: "测量日期",
    },
    howto: {
      title: "怎么用",
      items: [
        "把图片拖进来、直接粘贴截图，或者点击选择图片。支持 HEIC / HEIF / JPEG / PNG / WebP。",
        "需要时调整输出格式、质量与最大宽度；也可以设一个目标大小（比如 500 KB），工具会自动选好压缩参数。",
        "处理完逐张下载，或者打包成一个 ZIP。",
      ],
    },
    dropzone: {
      rejected: "有 {n} 个文件不是图片，已忽略。支持 HEIC / HEIF / JPEG / PNG / WebP。",
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
      clearAllConfirm: "要清空当前批次吗？尚未下载的结果会丢失。",
      discardBatchConfirm: "要返回首页并丢弃当前批次吗？",
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
      targetSizePng: "PNG 暂不支持按目标大小压缩",
      targetMet: "已达到大小目标",
      targetMissed: "已用最低质量，仍高于目标",
      targetAlreadyMet: "原图已低于目标",
      batchNaming: "批量命名",
      namingTemplate: "文件名模板",
      namingHint: "可用：{name} 原名、{n} 序号、{width}、{height}",
      filenameExample: "实时示例",
      exportPreparing: "正在打包",
      exportError: "打包失败，请重试",
      fineTune: "细调",
      originalSize: "原始尺寸",
      noTarget: "不设目标",
    },
    presets: {
      presetWeb: "Web 优化",
      presetSocial: "社交媒体",
      presetEcommerce: "电商商品图",
      presetMax: "最佳质量",
      recommended: "推荐",
      descriptions: {
        web: "网页与日常分享，兼顾清晰度和体积",
        social: "适合常见社交平台的 JPEG",
        ecommerce: "保留商品细节并控制上传体积",
        quality: "优先画质，不限制尺寸与目标体积",
      },
    },
    download: "下载",
    downloadAll: "下载全部",
    downloadZip: "下载 ZIP",
    downloadIndividual: "逐张下载",
    summary: {
      totalChange: "体积变化",
      totalFiles: "文件数",
      totalOriginal: "原始大小",
      totalCompressed: "压缩后大小",
    },
    theme: { light: "浅色", dark: "深色", auto: "系统", switchTo: "切换到" },
    lang: "语言",
    footerClaims: ["纯本地处理", "图片不会上传", "免费使用"],
    footerPrivacy: "隐私政策",
    footerTerms: "服务条款",
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
    faq: {
      title: "常见问题",
      items: [
        {
          q: "图片会上传到服务器吗？",
          a: "不会。所有压缩处理完全在你的浏览器本地完成。图片不会离开你的设备，我们无法访问你的任何图片。你甚至可以断开网络连接后继续使用。",
        },
        {
          q: "支持哪些图片格式？",
          a: "输入支持 iPhone HEIC/HEIF，以及 JPEG、PNG、WebP 等常见格式。输出可选 WebP、PNG 或 JPEG。动图会按静态图片处理。",
        },
        {
          q: "为什么暂不提供 AVIF 输出？",
          a: "浏览器能显示 AVIF，不代表能可靠地生成 AVIF。等编码能力验证过我们再提供，免得下载到打不开的文件。",
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
    hero: {
      claim: "Images are never uploaded. Compression runs in your browser.",
      samples: "Choose a sample image",
      sampleLabels: ["Aerial cloud photo", "Aerial desert photo"],
      samplesNote: "These examples were compressed by this tool.",
      sampleError: "The example could not be loaded. Choose one of your own images instead.",
    },
    measure: {
      title: "A real measurement",
      sample: "Example photo",
      original: "Source",
      output: "Output",
      elapsed: "Elapsed",
      environment: "Environment",
      browser: "Browser",
      os: "Operating system",
      params: "Settings",
      preset: "Preset",
      format: "Format",
      quality: "Quality",
      maxEdge: "Max edge",
      target: "Target",
      date: "Measured on",
    },
    howto: {
      title: "How to use it",
      items: [
        "Drop images in, paste a screenshot, or click to choose files. HEIC / HEIF / JPEG / PNG / WebP are supported.",
        "Adjust output format, quality, and max width when you need to, or set a target size (say 500 KB) and let the tool pick the settings.",
        "Download files one by one when you are done, or export them as a ZIP.",
      ],
    },
    dropzone: {
      rejected:
        "Skipped {n} file(s) that aren't images. Supported: HEIC / HEIF / JPEG / PNG / WebP.",
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
      clearAllConfirm: "Clear this batch? Results you have not downloaded will be lost.",
      discardBatchConfirm: "Return home and discard this batch?",
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
      targetSizeHint: "Leave blank to compress by quality only (20–10240 KB)",
      targetSizePng: "PNG doesn't support a target size yet",
      targetMet: "Size target met",
      targetMissed: "Still above target at minimum quality",
      targetAlreadyMet: "Source already under target",
      batchNaming: "Batch naming",
      namingTemplate: "Filename template",
      namingHint: "Tokens: {name}, {n}, {width}, {height}",
      filenameExample: "Live example",
      exportPreparing: "Preparing package",
      exportError: "Package creation failed. Try again.",
      fineTune: "Fine-tune",
      originalSize: "Original size",
      noTarget: "No target",
    },
    presets: {
      presetWeb: "Web optimized",
      presetSocial: "Social media",
      presetEcommerce: "E-commerce",
      presetMax: "Best quality",
      recommended: "Recommended",
      descriptions: {
        web: "Balanced clarity and size for websites and everyday sharing",
        social: "JPEG sized for common social platforms",
        ecommerce: "Keeps product detail while controlling upload size",
        quality: "Prioritizes quality with no size or byte target",
      },
    },
    download: "Download",
    downloadAll: "Download all",
    downloadZip: "Download ZIP",
    downloadIndividual: "Download individually",
    summary: {
      totalChange: "Size change",
      totalFiles: "Files",
      totalOriginal: "Original",
      totalCompressed: "Compressed",
    },
    theme: { light: "Light", dark: "Dark", auto: "System", switchTo: "Switch to" },
    lang: "Language",
    footerClaims: ["Runs in your browser", "Images are never uploaded", "Free to use"],
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Service",
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
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          q: "Are my images uploaded to a server?",
          a: "No. All compression happens entirely in your browser. Images never leave your device. You can even disconnect from the internet and keep using the tool.",
        },
        {
          q: "Which formats are supported?",
          a: "Input supports iPhone HEIC/HEIF plus common formats like JPEG, PNG, and WebP. Output can be WebP, PNG, or JPEG. Animated images are saved as still images.",
        },
        {
          q: "Why isn't AVIF output available yet?",
          a: "Browsers can display AVIF long before they can encode it reliably. We'll add it once the encoder checks out, so downloads always open as real AVIF.",
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
};
