# Open Lovable 简体中文开源交接手册

## 文档目标

本文用于在新的对话中继续完成 Open Lovable 简体中文社区版的整理、发布和维护。它记录当前基线、推荐的开源形式、发布前技术债，以及一套不会误推到官方仓库的 Git 流程。

建议项目定位：**Open Lovable 非官方简体中文社区版**。推荐仓库名：`open-lovable-zh-CN`。

## 2026-08-12 整理状态

开源前的主要代码与仓库整理已经拆分为五个功能提交；本文件及社区文档由最后的 docs 提交收口。尚未创建 tag、远程社区仓库或 GitHub Release，也没有执行 `git push` 或 `git fetch --unshallow`。

已创建的功能提交：

- `170fbbe chore: harden release toolchain and dependencies`
- `059d2b1 fix: support OpenAI-compatible chat providers`
- `c6b31b7 fix: update Firecrawl and sandbox generation flow`
- `97a32f2 refactor: add typed localization foundation`
- `46fe6ad feat: add Simplified Chinese interface`

已完成：

- 清理 `.env.example`，补齐 E2B、Vercel Sandbox、OpenAI 兼容 provider 和公开模型覆盖配置。
- 将本地日志加入 `.gitignore`，明确 `pnpm-workspace.yaml` 与 `packages/*` 工作区。
- 修正失效脚本和 ESLint 生成目录误报，新增 `lint`、`typecheck` 与 `check`。
- 在 Next.js 15 主版本内升级到安全修补版 `15.5.23`，并更新 Browserslist 数据。
- 更新高风险直接依赖，移除陈旧 npm/Bun 锁文件，并用限定 override 修复 Next.js 固定的传递依赖风险。
- 建立 `locales/en.ts` 与 `locales/zh-CN.ts` 类型化语言表，现有静态中文文案已从组件迁出。
- 保留英文内部状态和 API 流程，在 `lib/localize-ui.ts` 展示层翻译动态状态。
- 补齐中文 README、首页截图、CHANGELOG、贡献指南、安全策略、发布清单、Issue/PR 模板、Dependabot 和 CI。
- 修复移动端首页展开表单时提交按钮被裁切的问题。
- 将生成工作区改为移动端上下分区、桌面端左右分区，避免窄栏不可用。
- 生成页改为按需创建沙箱；直接访问 `/generation` 不再立即产生付费沙箱。

已验证：

- `pnpm run check` 通过，包含零警告 ESLint 和 TypeScript 类型检查。
- `pnpm build` 通过，Next.js 共生成 33 个静态或动态路由，构建无 Browserslist 过期提示。
- `pnpm install --frozen-lockfile --ignore-scripts` 通过；`pnpm audit --prod` 为 0 critical、0 high、0 moderate、1 low。
- 剩余 low 来自 `@ai-sdk/provider-utils`，公告要求的 `3.0.98` 修复版尚未发布；未采用跨主版本升级或不兼容 override。
- 桌面 `1440x1000` 与移动 `390x844` 的首页、首页展开表单和生成工作区均无根级横向溢出或控件裁切。
- 浏览器控制台没有新增 error 或 warning。
- UI 验收只调用本地会话清理和沙箱状态查询，没有创建沙箱、抓取网站或调用模型。
- README 截图位于 `docs/images/home-zh-CN.png`。
- 开发服务已恢复到 `http://127.0.0.1:3000`。

下次继续顺序：

1. 用户确认准确的 GitHub 仓库 URL、账号和可见性。
2. 获取完整上游历史，将官方远程改名为 `upstream`，并把确认后的社区仓库配置为 `origin`。
3. 从明确上游基线生成 patch，并在独立干净工作树执行 `git apply --check`。
4. 再次确认远程指向后推送，创建 `v3-zh.1` tag 与 GitHub Release，并附带校验过的 patch。

## 当前基线

- 官方上游：`https://github.com/firecrawl/open-lovable.git`
- 当前基线提交：`69bd93bae7a9c97ef989eb70aabe6797fb3dac89`（`v3`）
- 原项目许可证：MIT License
- 当前仓库：shallow clone
- 当前远程 `origin`：仍指向官方上游，不能直接作为中文社区版的推送目标
- 本地已经过端到端联调，开发地址为 `http://127.0.0.1:3000`
- 最近的 `pnpm run check` 和 `pnpm build` 均通过
- 生产依赖审计无 critical、high 或 moderate，仅有一个暂无可用同主版本修复包的 low

发布准备改动已经按功能整理为提交。继续远程操作前仍必须重新执行 `git status --short` 和 `git log --oneline`，以实际输出为准。

## 已完成内容

### 中文界面

第一轮汉化已覆盖：

- 首页及 URL 输入流程
- 风格选择
- 生成工作区和侧栏输入
- 沙箱状态与运行进度
- 主要错误、下载和操作提示
- 品牌规范面板
- 页面 metadata 和 `lang="zh-CN"`

品牌名、模型名、URL、文件名、代码、命令输出及 AI 技术提示词仍保留原文。动态英文状态通过 `lib/localize-ui.ts` 在显示层转换，内部英文值没有改变。

### 运行兼容性

除汉化外，工作区还包含这些实用修复：

- Firecrawl scrape API 从 v1 迁移到 v2，并移除受限制 actions
- E2B 沙箱链路完成联调
- 支持带自定义 `OPENAI_BASE_URL` 的第三方 OpenAI 兼容模型
- 通过 `OPENAI_API_MODE=chat` 适配仅支持 Chat Completions 的服务
- 修复新建沙箱后生成流程读取旧 state 的并发竞态

这些不是纯翻译改动。发布历史应将“运行兼容性修复”和“界面汉化”拆开，便于审查、回滚和向上游贡献。

## 推荐开源形式

首选方案是维护一个 GitHub Fork/派生仓库，并在 Release 中附带基于明确上游提交生成的 `.patch` 文件。

选择完整仓库的原因：原项目目前没有成熟 i18n 层，汉化分散在多个组件中。只发布补丁会让普通用户安装困难，也会在上游结构变化后频繁失效。完整仓库适合直接部署、提 issue 和持续同步；patch 则方便已有官方仓库的开发者审阅或选择性应用。

推荐首个版本号：`v3-zh.1`。版本说明必须同时写明上游基线 `69bd93b`，不要只写“最新版”。

若后续把通用 i18n 基础设施整理得足够独立，可另向官方上游提交 PR。上游 PR 应聚焦语言基础设施，不应混入第三方模型配置或中文社区版的品牌说明。

## 许可证与署名

MIT License 允许修改、分发和再发布，但必须保留原始版权和许可证文本。

发布时应做到：

- 原样保留仓库根目录的 `LICENSE`。
- 在 README 首屏附近明确写明“非官方简体中文社区版本”。
- 链接官方项目和官方作者，不暗示 Firecrawl 官方维护或背书。
- 清楚区分上游原始功能、社区汉化和本仓库额外兼容性修复。
- 如果新增自己的版权声明，不得替换或遮盖原作者声明。
- 仓库描述、Release 和社交宣传中都使用相同的非官方定位。

这份手册是工程交接建议，不是法律意见。若未来加入新字体、截图或其他第三方资源，应逐项确认其再分发许可。

## 发布前技术整理状态

环境模板、忽略规则、类型化语言表、中文 README、贡献与安全说明、Issue/PR 模板、Dependabot 和无外部付费调用的 CI 已完成。以下内容保留为维护说明；浏览器验收、提交拆分、远程配置和 Release 仍需在发布前完成。

### 1. 清理工作区

先检查而不是直接删除：

```powershell
git status --short
git diff --stat
git diff --check
```

不得提交：

- `.env.local` 或任何真实密钥
- `.codex-dev.stdout.log`、`.codex-dev.stderr.log` 等本地日志
- `.next/`、`node_modules/`、`*.tsbuildinfo`
- 含账号、鉴权 query、真实服务商密钥或私人端点的截图与测试数据

`pnpm-workspace.yaml` 已明确包含 `packages/*` 工作区和必要的 native build allowlist，应作为可复现安装配置纳入发布提交。

### 2. 整理 `.env.example`

以下问题已修复：

- 有一行孤立的 `=======`
- `GROQ_API_KEY` 重复
- 缺少 `OPENAI_BASE_URL` 和 `OPENAI_API_MODE`
- 默认展示 Vercel Sandbox，而当前本地实测主要使用 E2B

模板已区分 Vercel 与 E2B 两种沙箱配置，并只使用安全占位符。第三方 OpenAI 兼容服务的最小示例如下：

```env
FIRECRAWL_API_KEY=your_firecrawl_api_key
SANDBOX_PROVIDER=e2b
E2B_API_KEY=your_e2b_api_key
OPENAI_API_KEY=your_provider_key
OPENAI_BASE_URL=https://your-provider.example/v1
OPENAI_API_MODE=chat
```

### 3. 建立轻量 i18n 结构

当前已在不引入重量依赖的前提下建立类型化语言表：

```text
locales/
  en.ts
  zh-CN.ts
```

已完成的目标：

- 把组件内静态中文迁移为稳定 key。
- 让 `en.ts` 和 `zh-CN.ts` 共享 TypeScript 类型，避免漏翻或拼错 key。
- 保留服务端日志、AI prompt、API payload 和程序判断所需的稳定英文值。
- 第一版可固定为简体中文，不必为了形式完整立即加入复杂语言切换器。

动态状态已集中到展示层映射；仍有一部分兼容旧流程的完整英文句子匹配。后续新增或重构状态时应改为“状态代码 + 参数”，逐步移除该兼容层。

### 4. 检查汉化完整度

使用 `rg` 搜索可见英文只是线索，不能机械替换。逐页检查首页、风格选择、生成侧栏、顶部操作区、预览、进度、错误、空状态和弹窗。以下内容通常应保留英文：品牌、模型、URL、文件名、代码、命令和发送给模型的技术提示词。

浏览器验收至少覆盖桌面和移动视口，并确认：

- 没有乱码或中英文无意义混排
- 长中文没有挤出按钮、侧栏或弹窗
- 页面没有横向滚动和内容遮挡
- 动态状态翻译不改变内部流程
- 控制台没有新增错误

普通 UI 验收应复用已有状态。Firecrawl、E2B 和 AI 模型都可能产生真实费用，未经用户同意不要重复执行完整生成。

## 推荐提交拆分

不要把全部未提交改动压成一个“汉化”提交。建议按以下顺序整理，每一步都保持可构建：

1. `fix: support OpenAI-compatible chat providers`
2. `fix: update Firecrawl and sandbox generation flow`
3. `refactor: add typed localization foundation`
4. `feat: add Simplified Chinese interface`
5. `docs: add Chinese setup and deployment guide`

实际拆分前先逐个阅读 diff。若一个文件同时包含运行修复和翻译，可使用小范围手工补丁或非交互式暂存方式拆分；不要使用不熟悉的交互式 Git 操作，也不要回退用户已有改动。

提交信息可使用英文以便上游审阅，README 和 Release 可中英双语。每个提交应避免夹带格式化噪音、日志或密钥。

## 远程仓库与 Git 流程

### 1. 获取完整上游历史

在当前 `origin` 仍指向官方仓库时：

```powershell
git fetch --unshallow origin
```

如果远程已经改名为 `upstream`：

```powershell
git fetch --unshallow upstream
```

### 2. 配置社区版远程仓库

先由用户在 GitHub 创建或确认目标仓库，并提供准确 URL。不得猜测用户名、替用户创建外部仓库或直接推送。

确认 URL 后执行：

```powershell
git remote rename origin upstream
git remote add origin https://github.com/<USER>/open-lovable-zh-CN.git
git remote -v
```

推送前再次确认 `origin` 是用户仓库、`upstream` 是 Firecrawl 官方仓库。

### 3. 分支和推送

建议以 `main` 作为稳定中文分支，在独立功能分支完成发布整理。例如：

```powershell
git switch -c chore/prepare-zh-release
```

完成提交和验收后，根据目标仓库的默认分支配置再推送。任何 `git push`、创建 GitHub Release 或公开仓库操作，都应在用户确认目标 URL、可见性和账号后执行。

## README 必备内容

中文社区版 README 至少应包含：

- 非官方社区版声明和官方仓库链接
- 中文版截图，且截图中不含密钥、私人 URL 或用户数据
- 功能概览与汉化范围
- Node.js、pnpm 等运行前提
- 安装、环境变量、启动和构建命令
- Firecrawl、E2B/Vercel Sandbox、模型 provider 的申请入口和用途
- 第三方 OpenAI 兼容服务的 `OPENAI_BASE_URL` 与 `OPENAI_API_MODE=chat` 示例
- API 可能产生费用的醒目说明
- 已知限制，包括当前语言切换能力和上游版本基线
- 上游同步策略、贡献方式和 issue 模板入口
- MIT License 与致谢

不要在 README 中承诺“支持所有 OpenAI 兼容服务”。不同第三方接口对模型 ID、流式响应、tool call 和 Chat/Responses API 的兼容程度不同，应表述为“已提供兼容入口，具体取决于服务商实现”。

## CI 与发布验收

建议 GitHub Actions 使用与本地一致的 Node.js 和 pnpm 版本，并至少执行：

```powershell
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm build
```

CI 不应调用真实 Firecrawl、E2B 或 AI API。若构建阶段需要环境变量，应使用无权限占位符，并确保代码不会在 build 时发起外部请求。

首个公开版本发布前逐项确认：

- `git diff --check` 通过
- 类型检查和生产构建通过
- 开发服务重启后首页返回 HTTP 200
- 桌面与移动端中文界面验收通过
- `.env.local`、日志和生成目录未被跟踪
- 仓库历史中没有真实密钥；如曾误提交，必须先轮换密钥，再重写历史
- `LICENSE` 保留，README 有非官方声明和上游链接
- `origin` 与 `upstream` 指向正确
- Release 标注上游 commit、变更范围、已知限制和升级方法

注意：开发服务器与 `pnpm build` 共用 `.next`。本地验收时先停止 dev，再构建，最后重新启动 dev；不要并发运行两者。

## Release 与补丁包

推荐首个 tag：

```text
v3-zh.1
```

Release 说明建议包含：

- 基于上游 `69bd93bae7a9c97ef989eb70aabe6797fb3dac89`
- 已汉化页面和仍保留英文的范围
- 第三方 OpenAI、Firecrawl、E2B 兼容性改动
- 配置迁移说明
- 已知问题
- 完整仓库安装方式与 patch 应用方式

patch 必须基于明确上游基线生成，而不是基于模糊的本地工作区。例如在发布提交完成后，使用完整 commit 范围生成补丁，并让 Git 直接写文件以避免 PowerShell 重定向改变编码：

```powershell
git diff --binary 69bd93bae7a9c97ef989eb70aabe6797fb3dac89..HEAD --output=open-lovable-v3-zh.1.patch
git apply --stat open-lovable-v3-zh.1.patch
```

然后在检出上游基线 `69bd93b` 的独立干净工作树中执行 `git apply --check <patch-path>`。不要在已经包含这些修改的当前分支上用正向 apply 校验，否则会因为改动已经存在而产生误判。

生成的 patch 应作为 Release 附件，不应替代源码仓库。发布前打开检查其文件列表和文本内容，确保没有 `.env.local`、日志或私人端点。

## 上游同步维护

建议每次同步都从单独分支开始：

```powershell
git fetch upstream
git switch -c sync/upstream-<version>
```

先阅读上游变更，再选择 merge 或 rebase；不要机械覆盖中文文件。同步后重点复验：

- Firecrawl API 路径和请求参数
- OpenAI provider 初始化和 chat 模式
- 沙箱 ID 的创建与传递
- 组件文案 key 和动态状态码
- 下载、预览、错误处理和移动布局

每次社区版 Release 都记录对应的上游 commit。若上游已实现同类修复，应删除重复补丁并采用上游实现；若上游 UI 改动引入新文案，应同时更新两种语言表。

## 新对话启动提示词

在新的 Codex 对话中可以直接发送：

```text
请先完整阅读仓库根目录 AGENTS.md 和 docs/OPEN_SOURCE_ZH_HANDOFF.md，并检查 git status、远程仓库、当前分支和最近提交。我们要继续整理 Open Lovable 非官方简体中文社区版。先汇报当前状态与下一步，不要读取或输出 .env.local，不要调用会产生费用的 Firecrawl、E2B 或 AI 接口，也不要执行 git push 或创建 GitHub 仓库，直到我明确确认目标仓库 URL 和发布操作。
```

如果要直接进入发布前整理，可追加：

```text
请按交接手册完成最终浏览器验收、工作区审计和提交拆分。保留现有兼容性修复，每完成一阶段都执行相应验证并说明差异。
```

## 下一阶段建议顺序

1. 完成生产构建、桌面与移动端浏览器验收，并补充 README 中文截图。
2. 逐文件审查并按功能拆分提交。
3. 用户确认 GitHub 仓库 URL 后配置远程并推送。
4. 创建 `v3-zh.1` Release，并附带经过检查的 patch。
5. 后续新增动态状态时逐步改为状态代码加参数，减少完整英文句子匹配。
