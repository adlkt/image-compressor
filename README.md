# Image Compressor

一个简单、隐私优先的图片压缩与格式转换应用。所有处理都在浏览器本地完成，图片不会上传到服务器。

## 功能

- 批量导入、拖放或粘贴图片，包括 iPhone 的 HEIC/HEIF 照片
- 输出 WebP、JPEG 或 PNG
- 调整图片质量、最大宽度和目标文件大小
- 实时预览压缩结果与体积变化
- 单张下载、批量下载或导出 ZIP
- 中文、英文界面与明暗主题

## 技术栈

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- Web Worker + Canvas 编码
- `heic-to` + libheif WebAssembly 本地解码
