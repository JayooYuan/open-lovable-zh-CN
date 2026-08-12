# 贡献指南

感谢你改进 Open Lovable 简体中文社区版。提交代码表示你同意贡献内容按仓库 MIT License 分发。

## 开始开发

1. 使用 Node.js 20.9+ 与 pnpm 10+。
2. 运行 `pnpm install --frozen-lockfile`。
3. 将 `.env.example` 复制为 `.env.local`，只填写本地需要的服务。
4. 从 `main` 创建范围明确的功能分支。

未经明确授权，不要为了 UI 或文案修改触发真实 Firecrawl、E2B、Vercel Sandbox 或模型请求。这些服务可能产生费用。

## 改动原则

- 保留上游版权、`LICENSE` 和非官方社区版声明。
- 不提交密钥、私人端点、用户数据、`.env.local`、日志、`.next` 或 `node_modules`。
- 保持运行修复、语言基础设施、中文文案和文档为可独立审查的改动。
- 遵循现有组件与样式体系，避免夹带无关重构或格式化噪音。
- 修改 Firecrawl、模型 provider 或沙箱流程时，说明兼容性依据和失败回退。

## 汉化规范

- 面向用户的按钮、标签、提示、状态、错误和 metadata 应进入类型化语言表。
- 新增 key 时同时更新 `locales/en.ts` 与 `locales/zh-CN.ts`。
- 保留品牌名、URL、文件名、代码、终端命令、API 字段和模型 ID。
- 服务端日志和内部状态使用稳定英文或状态码，在展示边界翻译。
- 不翻译 AI 技术提示词，除非 PR 同时提供生成回归验证。
- 检查紧凑按钮、侧栏、弹窗和移动视口中的中文是否溢出。

## 验证

提交前至少执行：

```bash
pnpm check
pnpm build
git diff --check
```

界面改动还应检查桌面与移动视口、浏览器控制台和失败的网络请求。优先使用不调用外部付费 API 的现有状态。

## PR 内容

PR 请说明问题、解决方式、验证结果、界面截图和剩余风险。若改动源自上游 Issue 或 commit，请附链接；若改变环境变量，请同步更新 `.env.example` 与 README。
