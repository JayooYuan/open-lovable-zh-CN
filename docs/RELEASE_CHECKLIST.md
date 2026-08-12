# 社区版发布检查清单

## 代码与质量

- [ ] `pnpm install --frozen-lockfile` 可在干净环境完成。
- [ ] `pnpm check` 通过。
- [ ] `pnpm audit --prod --audit-level=high` 通过，并记录仍存在的低等级公告。
- [ ] 停止开发服务后执行 `pnpm build` 并通过。
- [ ] 恢复开发服务，首页返回 HTTP 200。
- [ ] 桌面与移动端中文界面无乱码、溢出或遮挡。
- [ ] CI 不调用 Firecrawl、沙箱或模型服务。

## 安全与许可

- [ ] `git diff --check` 通过。
- [ ] 已检查提交范围和历史中不存在真实密钥、私人端点或用户数据。
- [ ] `.env.local`、本地日志、`.next`、`node_modules` 和 `*.tsbuildinfo` 未被跟踪。
- [ ] 根目录 `LICENSE` 保持原样。
- [ ] README 明确标注非官方社区版、上游链接与 API 费用风险。
- [ ] 新增图片、字体和第三方资源已确认再分发许可。

## Git 与发布

- [ ] 每个提交范围明确，运行修复、i18n、中文文案与文档可以独立审查。
- [ ] `origin` 指向社区仓库，`upstream` 指向 Firecrawl 官方仓库。
- [ ] Release 标注上游 commit `69bd93bae7a9c97ef989eb70aabe6797fb3dac89`。
- [ ] tag 使用 `v3-zh.1`，Release 包含配置迁移、已知限制和升级说明。
- [ ] patch 从明确上游基线到发布 commit 生成，并在独立干净工作树通过 `git apply --check`。
- [ ] patch 文件列表不包含环境文件、日志、构建产物或私人数据。
