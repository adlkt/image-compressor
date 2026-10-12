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

## 部署

生产域名：https://image-compressor.ichinosehonami.com

推送到 GitHub 的 `main` 分支后，GitHub Actions 自动安装依赖、执行 lint 和测试、构建静态页面，并部署到现有 Cloudflare Pages 的 `image-compressor` 项目。也可以在 Actions 页面手动运行 `Deploy to Cloudflare Pages`。

仓库的 Settings → Secrets and variables → Actions 需要配置：

- `CLOUDFLARE_ACCOUNT_ID`：Pages 项目所属的 Cloudflare 账号 ID。
- `CLOUDFLARE_API_TOKEN`：限定到该账号、具有 `Account → Cloudflare Pages → Edit` 权限的 API Token。

依赖通过已提交的 `package-lock.json` 和 `npm ci` 安装；任一检查失败都不会部署。自动部署配置位于 `.github/workflows/deploy.yml`。

本地手动部署仍可使用：

```sh
npm run build
CLOUDFLARE_ACCOUNT_ID=b8d9fe70db0dbe5ad73caa80c514c854 wrangler pages deploy out --project-name=image-compressor --branch=main
```

产物目录为 `out/`，站点在域名根目录提供服务。执行部署前确认 Wrangler 登录的是域名所属账号。
