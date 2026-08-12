# 变更记录

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 的结构。社区版版本号同时记录明确的上游基线。

## [Unreleased]

### Added

- 简体中文首页、生成工作区、状态、错误、下载和品牌规范界面。
- 类型化 `en` / `zh-CN` 语言表与动态状态展示层翻译。
- OpenAI 兼容 Chat Completions 模式和自定义 base URL 配置。
- 中文安装、贡献、安全与发布文档，以及无付费外部调用的 CI。

### Changed

- Firecrawl scrape API 更新为 v2，并移除受限 actions。
- 沙箱创建结果直接传递给后续生成与应用流程，避免异步 state 竞态。
- Next.js 在 15.x 内升级到安全修补版本。
- E2B、Firecrawl、Pixi、Tailwind、AI SDK 等直接依赖更新到兼容的安全补丁版本。
- 安装流程统一使用 pnpm，移除已过期的 npm 与 Bun 锁文件。

### Fixed

- 清理公开环境模板中的冲突标记、重复变量和缺失的第三方 provider 配置。
- ESLint 不再扫描 `.next` 等生成目录，失效的测试脚本已移除。
- 通过受限 pnpm override 修复 Next.js 15 固定的 PostCSS 与 Sharp 传递依赖风险。

### Security

- `pnpm audit --prod` 当前为 0 critical、0 high、0 moderate、1 low。
- 剩余 low 来自 `@ai-sdk/provider-utils`；公告要求的 `3.0.98` 修复版尚未发布，本版本不通过跨主版本升级或不兼容 override 强行规避。

## 计划版本 `v3-zh.1`

- 上游基线：`69bd93bae7a9c97ef989eb70aabe6797fb3dac89`
- 状态：发布前整理中，尚未创建公开 tag 或 Release。
