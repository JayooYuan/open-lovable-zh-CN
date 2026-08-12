# Open Lovable 项目操作手册

## 用途

本文件供 Codex 或其他开发者在新的对话中快速接手本仓库。开始工作前先阅读本文件，再根据任务查看相关源码和 `git status`。本文件描述的是 2026-08-11 的工作基线；源码和 Git 状态始终是最终依据。

## 仓库位置

- 实际仓库根目录：包含本文件与 `package.json` 的目录；不要停留在外层同名目录。
- 上游仓库：`https://github.com/firecrawl/open-lovable.git`
- 当前上游基线：`69bd93bae7a9c97ef989eb70aabe6797fb3dac89`（提交说明 `v3`）
- 当前仓库是 shallow clone。需要完整历史时执行 `git fetch --unshallow origin`；如果远程已按开源流程改名，则执行 `git fetch --unshallow upstream`。
- 本地开发地址：`http://127.0.0.1:3000`

## 新对话开始步骤

1. 确认工作目录是上述实际仓库根目录，不要停留在外层同名目录。
2. 执行 `git status --short`，区分用户已有修改与本次任务产生的修改。
3. 阅读与任务相关的源码；若任务涉及开源发布，再阅读 `docs/OPEN_SOURCE_ZH_HANDOFF.md`。
4. 检查开发服务是否已运行。不要无故启动第二个服务，也不要覆盖用户现有日志。
5. 修改前说明范围；修改后按风险执行类型检查、构建和浏览器验收。

不得回退、覆盖或清理无法确认来源的现有修改。第三方模型兼容、Firecrawl/E2B 修复、i18n 基础和中文界面已经拆分为发布准备提交；后续整理必须保留这些提交与行为。

## 当前可用状态

项目已完成一次端到端联调，以下流程可以工作：

- Firecrawl 抓取目标网页和截图
- 创建 E2B 沙箱
- 调用 OpenAI 兼容的第三方模型
- 生成并应用代码
- 在 iframe 中预览结果
- 下载生成项目的 ZIP 文件

界面已完成第一轮简体中文化，包括首页、风格选择、生成工作区、沙箱状态、运行进度、主要错误和下载提示、品牌规范面板、页面 metadata，以及根页面的 `lang="zh-CN"`。

项目已建立轻量类型化语言表。静态文案集中在 `locales/en.ts` 与 `locales/zh-CN.ts`，两种语言共享 TypeScript 结构；当前界面固定为简体中文，尚未提供运行时语言切换。动态运行状态通过 `lib/localize-ui.ts` 的 `localizeUiText()` 在显示层翻译，内部状态仍保留英文，以免破坏现有 `includes(...)` 判断和业务流程。

## 技术栈与结构

- Next.js 15 App Router、React 19、TypeScript
- Tailwind CSS、Radix UI，以及项目已有的图标库
- Vercel AI SDK 和多个模型 provider
- Firecrawl 负责网页抓取
- E2B 或 Vercel Sandbox 负责隔离运行生成项目
- pnpm 是当前实际使用的包管理器

关键位置：

- `app/page.tsx`：首页入口
- `app/generation/page.tsx`：生成工作区和主要客户端流程
- `app/api/`：抓取、模型调用、沙箱和下载等服务端接口
- `components/`：首页、生成页、预览和进度组件
- `config/app.config.ts`：模型与应用配置
- `locales/`：类型化英文源文案和简体中文语言表
- `lib/localize-ui.ts`：动态状态的显示层中文映射
- `.env.example`：仅含占位符的公开配置模板
- `.env.local`：本机真实配置，不得读取后输出或提交

## 环境配置

不要在对话、文档、提交、截图或日志中暴露真实密钥。需要说明配置时只使用占位符。当前本地联调所需的核心配置形态如下：

```env
FIRECRAWL_API_KEY=your_firecrawl_api_key
SANDBOX_PROVIDER=e2b
E2B_API_KEY=your_e2b_api_key
OPENAI_API_KEY=your_provider_key
OPENAI_BASE_URL=https://your-provider.example/v1
OPENAI_API_MODE=chat
```

说明：

- `OPENAI_API_MODE=chat` 用于只兼容 Chat Completions 的第三方 OpenAI 接口。
- 当前默认模型在 `config/app.config.ts` 中配置为 `openai/gpt-5.6-sol`，显示名为 `GPT-5.6 Sol`。
- 更换第三方服务时，先确认其 base URL、模型 ID 和 Chat Completions 兼容性，不要只替换密钥。
- Firecrawl、E2B 和模型服务均可能按量计费。没有用户明确授权时，不要为了普通 UI 验收触发真实抓取、沙箱创建或 AI 生成。

## 常用命令

首次安装或依赖变化后：

```powershell
pnpm install
```

启动开发服务：

```powershell
pnpm dev
```

类型检查：

```powershell
pnpm exec tsc --noEmit
```

生产构建：

```powershell
pnpm build
```

开发服务和生产构建共用 `.next`。不要在 `pnpm dev` 正在运行时直接执行 `pnpm build`，否则开发服务可能暂时返回 500。需要构建时先停止开发服务，构建结束后再重新运行 `pnpm dev`。

`package.json` 中虽然存在 `lint` 脚本，但当前 Next.js 版本下应先验证脚本是否仍受支持，不要把未经确认的 `pnpm lint` 结果当作唯一验收依据。

## 验证流程

按改动风险选择验证范围：

1. 文档改动：检查 Markdown 内容、`git diff --check` 和敏感信息。
2. TypeScript 或组件改动：至少执行 `pnpm exec tsc --noEmit`。
3. 构建、配置、API 或跨模块改动：在停止 dev 后执行 `pnpm build`，之后恢复 dev。
4. 用户界面改动：在桌面和移动视口检查首页与生成页，确认无乱码、无横向溢出、文案不遮挡控件。
5. 端到端 API 验证：仅在确有必要且已获授权时执行，因为会调用付费外部服务。

浏览器验收时优先复用已有项目和历史状态，避免重复触发 AI、Firecrawl 或 E2B。至少观察浏览器控制台错误和失败的网络请求；不要只凭页面能打开就判定完成。

## 已有兼容性修复

后续同步上游或重构时需要保留并复验以下行为：

- `app/api/scrape-url-enhanced/route.ts` 使用 Firecrawl `/v2/scrape`，并移除了受地区限制的 actions。
- `app/api/scrape-screenshot/route.ts` 同样不再发送 actions。
- `app/api/analyze-edit-intent/route.ts` 支持 `OPENAI_API_MODE=chat`，API Key 回退使用逻辑或语义，避免空字符串阻断回退。
- `app/api/generate-ai-code-stream/route.ts` 支持相同的第三方 OpenAI 模式，并统一使用 OpenAI model 实例。
- `app/generation/page.tsx` 修复了沙箱创建的并发竞态，新创建的 sandbox ID 会直接传给后续生成和应用流程。

不要仅为了“代码更整洁”恢复到上游旧写法；这些改动解决的是已经复现过的运行问题。

## 汉化规则

继续汉化时遵守以下边界：

- 翻译面向最终用户的按钮、标签、提示、状态、错误信息和页面 metadata。
- 保留 `Open Lovable`、`Firecrawl`、模型名等品牌或产品名称。
- 不翻译 URL、文件名、代码、终端命令、API 字段和模型 ID。
- 不翻译发给 AI 的技术提示词，除非任务明确要求并完成回归验证。
- 动态状态优先在显示边界转换，内部值保持稳定。
- 新增映射前检查是否依赖完整英文句子。开源整理阶段应逐步改为状态代码加参数，并把静态文案抽离到类型化语言表。
- 中文文案应简洁、自然，避免逐词直译；同时检查紧凑按钮、侧栏和移动视口中的文字是否溢出。

## Git 与文件安全

- 修改前后都查看 `git status --short`。
- 不得提交 `.env.local`、`.next/`、`node_modules/`、`*.tsbuildinfo` 或本地日志。
- 当前 `.codex-dev.stdout.log` 和 `.codex-dev.stderr.log` 是本地服务日志，不应进入 Git。
- `pnpm-workspace.yaml` 定义 `packages/*` 工作区和必要的 native build allowlist，是可复现安装的一部分。
- 不得把真实 API Key、第三方服务账号信息或带鉴权参数的 URL 写入 issue、README、测试夹具或提交历史。
- 当前 `origin` 指向官方上游。在按开源交接手册配置自己的远程仓库前，不要执行 `git push`。
- 保留上游 `LICENSE` 和版权信息。

## 常见故障

### 开发页突然返回 500

先确认是否在 dev 运行期间执行了 `pnpm build`。停止相关进程，清晰地区分构建与开发阶段，再重启 `pnpm dev`。

### 第三方模型请求失败

依次核对 `OPENAI_BASE_URL`、真实模型 ID、`OPENAI_API_MODE=chat`、密钥是否为空，以及服务商是否真正兼容 OpenAI Chat Completions。不要输出密钥进行排查。

### 抓取接口失败

确认调用的是 Firecrawl v2 scrape 接口，且请求中没有重新加入当前账户或地区不支持的 actions。

### 已创建沙箱但后续提示没有 sandbox ID

检查 `app/generation/page.tsx` 的 `effectiveSandbox` 传递路径，避免重新引入依赖异步 React state 的竞态。

### 中文状态没有显示

确认最终展示文本是否经过 `localizeUiText()`。不要直接把内部英文状态改成中文，否则可能破坏流程判断。

## 完成标准

一次代码任务只有在以下条件满足后才算完成：改动范围符合请求；未覆盖用户已有修改；未泄露密钥；相关类型检查或构建通过；用户界面已按需验收；开发服务在需要时恢复可用；最终说明清楚修改文件、验证结果和仍存在的风险。
