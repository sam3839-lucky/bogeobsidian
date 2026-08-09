# Change Log

| 日期 | 阶段 | 操作 | 文件 | 原因 | 验证结果 | 回滚方式 |
|---|---|---|---|---|---|---|
| 2026-08-09 12:32:50 +08:00 | 阶段 1 | 创建备份父目录 | `E:\波哥Obsidian-Backups` | 保存 Vault 外回滚点 | 目录存在；首次压缩因通配符未展开而中止，未生成残缺 ZIP，且未写入 Vault | 若确认其中无其他备份，可手动删除空目录；本阶段不执行删除 |
| 2026-08-09 12:32:50 +08:00 | 阶段 1 | 创建外部压缩快照 | `E:\波哥Obsidian-Backups\波哥Obsidian-20260809-123250.zip` | Vault 尚未使用 Git，先建立文件级回滚点 | 文件存在，大小 2618 字节；ZIP 共 6 个条目；抽查 `欢迎.md` 可读取 | 先将当前 Vault 移至安全位置，再把该快照解压至 `E:\波哥Obsidian` |
| 2026-08-09 12:32:50 +08:00 | 阶段 1 | 建立跨阶段执行记录 | `96-System/Logs/Build-State.md`、`96-System/Logs/Change-Log.md`、`96-System/Config/Architecture Decisions.md` | 建立可验证的状态与架构决策记录 | 三个文件创建后执行读取验证 | 删除本阶段新增的 `96-System`，或从上述快照恢复 |
| 2026-08-09 12:48:51 +08:00 | Git 安全基线补充 | 创建 Git 忽略规则 | `.gitignore` | 排除设备状态、临时文件和常见凭据文件 | `workspace.json` 已忽略；凭据特征扫描无匹配 | 删除 `.gitignore` 可撤销规则；不自动执行 |
| 2026-08-09 12:48:51 +08:00 | Git 安全基线补充 | 初始化本地仓库并创建基线提交 | `.git` 与 9 个纳管文件 | 建立版本回滚能力 | 分支 `main`；提交 `a65ec033726eb644fdc22d7039b10c95e6b396c3`；工作区提交前为干净 | 如需移除 Git 元数据须另行确认；文件级恢复可使用阶段 1 ZIP |
| 2026-08-09 12:48:51 +08:00 | Git 安全基线补充 | 配置私有仓库远端并尝试首次 Push | `origin` → `https://github.com/sam3839-lucky/bogeobsidian` | 关联用户提供的 GitHub 私有仓库 | origin 已配置；Push 因连接重置失败；复核因低速超时失败；未 Force Push | 可移除 origin 撤销远端配置，但须另行确认 |
| 2026-08-09 13:01:04 +08:00 | Git 安全基线补充 | 首次 Push 成功并验证远端同步 | `main` → `origin/main` | 建立 GitHub 私有远端备份 | 本地、上游和远端均为 `6cea82b8d142031edd8e91709e252e9119b00e76`；未 Force Push；全局代理配置未修改 | 本地保留完整历史；如需撤销远端提交须另行评估，不自动改写远端 |
| 2026-08-09 13:09:48 +08:00 | 阶段 2 | 创建知识库架构指南 | `96-System/Guides/Knowledge Base Architecture.md` | 记录实际结构、目标结构和按需启用条件 | 文件存在且可读取；未创建空业务目录 | 使用 Git revert 撤销本阶段提交，或从阶段 1 快照恢复 |
| 2026-08-09 13:09:48 +08:00 | 阶段 2 | 创建目录职责规范 | `96-System/Config/Folder Responsibilities.md` | 明确每个目标目录的进入、流转与归档边界 | 所有目标目录均有职责说明 | 使用 Git revert 撤销本阶段提交 |
| 2026-08-09 13:09:48 +08:00 | 阶段 2 | 追加架构决策 | `96-System/Config/Architecture Decisions.md` | 固化按需建目录、单一主位置和 Topic 关联原则 | ADR-005、ADR-006 存在 | 使用 Git revert 撤销本阶段提交 |
| 2026-08-09 13:09:48 +08:00 | 阶段 2 | 更新执行状态 | `96-System/Logs/Build-State.md`、`96-System/Logs/Change-Log.md` | 建立阶段闭环记录 | 两个文件存在且可读取 | 使用 Git revert 撤销本阶段提交 |
| 2026-08-09 13:24:43 +08:00 | 阶段 3 | 建立元数据、命名与标签规范 | `96-System/Config` 下 3 个规范文件 | 统一 Properties 与受控值 | 文件已创建，待解析验证 | 使用 Git revert 撤销阶段 3 提交 |
| 2026-08-09 13:24:43 +08:00 | 阶段 3 | 创建 11 个无插件核心模板 | `90-Templates` | 提供一致且可复制的笔记起点 | 文件已创建，待 YAML、命名与插件语法验证 | 使用 Git revert 撤销阶段 3 提交 |
| 2026-08-09 13:24:43 +08:00 | 阶段 3 | 创建受控测试审计 | `96-System/Audits/2026-08-09 - Stage 3 Template Validation.md` | 以真实审计记录保存验证证据，避免临时伪知识 | 状态暂为 NOT_CHECKED | 使用 Git revert 撤销阶段 3 提交 |
| 2026-08-09 13:24:43 +08:00 | 阶段 3 | 追加架构决策并更新状态 | ADR-007、ADR-008、Build State、Change Log | 建立阶段治理闭环 | 文件已更新，待最终验证 | 使用 Git revert 撤销阶段 3 提交 |
| 2026-08-09 13:26:10 +08:00 | 阶段 3 | 完成 YAML、链接、ID、插件语法与文件名验证 | `96-System/Audits/2026-08-09 - Stage 3 Template Validation.md` | 验证规范和模板可用性 | YAML 12/12；链接 14/14；重复 ID 0；插件语法 0；非法文件名 0 | 使用 Git revert 撤销阶段 3 提交 |
| 2026-08-09 13:40:41 +08:00 | 阶段 4 | 建立资料导入、Triage、收集与 Cleaner 规范 | `96-System/Guides` 下 4 个文件 | 固化可回滚、信息无损的研究工作流 | 文件已创建，待测试 | 使用 Git revert 撤销阶段 4 提交 |
| 2026-08-09 13:40:41 +08:00 | 阶段 4 | 建立研究分类规则 | `96-System/Config/Research Classification Rules.md` | 统一领域、去向、Topic、链接与置信度建议 | 文件已创建，待测试 | 使用 Git revert 撤销阶段 4 提交 |
| 2026-08-09 13:40:41 +08:00 | 阶段 4 | 创建 6 组自有 Cleaner 测试样本 | `96-System/Audits/Stage-4-Research-Cleaner-Test` | 覆盖中文、英文、代码、表格、图片和标题层级 | 输入与输出已创建，结果待验证 | 使用 Git revert 撤销阶段 4 提交 |
| 2026-08-09 13:40:41 +08:00 | 阶段 4 | 追加 ADR-009、ADR-010 并更新状态 | ADR、Build State、Change Log | 建立阶段治理闭环 | 已写入，待最终测试 | 使用 Git revert 撤销阶段 4 提交 |
| 2026-08-09 13:42:14 +08:00 | 阶段 4 | 完成 6 组 Research Cleaner 规则测试 | `96-System/Audits/Stage-4-Research-Cleaner-Test` | 验证格式清理的信息无损和保护区规则 | 6/6 通过；信息丢失 0；来源失败 0；保护区失败 0；单文件人工试运行 VERIFIED；批量 BLOCKED | 使用 Git revert 撤销阶段 4 提交 |
| 2026-08-09 13:49:21 +08:00 | 阶段 5 | 创建 Topic 治理规则 | `96-System/Config/Topic Governance.md` | 定义数据支持、评分、同义词、Hub、Index、链接和退役规则 | 文件已创建；未创建空 Hub | 使用 Git revert 撤销阶段 5 提交 |
| 2026-08-09 13:49:21 +08:00 | 阶段 5 | 完成 Research 试点准入评估 | `96-System/Audits/2026-08-09 - Stage 5 Research Pilot Assessment.md` | 记录无真实 Research 的阻塞，防止虚构候选 | Research 0；候选 Topic 0；试点 BLOCKED | 使用 Git revert 撤销阶段 5 提交 |
| 2026-08-09 13:49:21 +08:00 | 阶段 5 | 追加 ADR-011、ADR-012 并更新状态 | ADR、Build State、Change Log | 区分规则完成与试点完成 | 未创建 `07-Topics`、Topic Index 或 Hub | 使用 Git revert 撤销阶段 5 提交 |