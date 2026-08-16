---
id: "proposal-inbox-auto-pipeline-v2"
type: "proposal"
title: "Inbox 定时清洗与归位自动化（V2 · 第二轮）"
status: "draft"
created: "2026-08-13"
updated: "2026-08-13"
domain: "系统治理"
tags: ["自动化", "Inbox", "清洗", "定时"]
related:
  - "[[Inbox自动清洗归位方案-第一轮]]"
  - "[[Real Estate Classification Rules]]"
---

# 目标

定时自动处理 `00-Inbox/Downloaded`：机械清洗 + 生成待核验清单 + 人工批量放行。

核心立场与 V1 一致且更明确：**自动清洗、自动提炼，人工放行（保底阀门）**。本方案不承诺"全自动无人归位"——任何进入正式库的动作都保留人工把关。

# 核心原则（防踩红线，V1 修订后）

1. **所有归位一律走第三层人工放行**，包括 AI 文档（89-Prompts/AI工具使用）与房地产/教育内容；任何层都不自动把文件移入 Research / Notes / 89-Prompts 等正式位。
2. 低置信度（low）内容留在待核验清单，不自动入库。
3. 原件不覆盖，始终保留在 Downloaded，直到放行或归档（可回滚）。
4. 清洗满足信息无损验证 + 保护区哈希（复用 Research Cleaner Spec）。
5. **第二层只产出"待核验清单 + 建议草稿"**，不批量写入正式笔记（遵守构建日志"未确认不批量生成"红线）。
6. 清洗只做格式规范化，不改写观点；版权 / 来源不可溯内容不强清洗。
7. 临时文件用完即清。

# 文件生命周期与位置

| 阶段 | 文件 | 位置 | 谁触发 |
|---|---|---|---|
| 输入 | 原始文件 | `00-Inbox/Downloaded` | 定时任务发现 |
| L1 清洗 | `<原名>--cleaned.md` | `00-Inbox/Cleaned` | 自动（原件不动） |
| L2 提炼 | `待核验清单-YYYYMMDD.md` | `00-Inbox/Cleaned` | 自动 |
| L2 审计 | 批次处理报告 | `96-System/Audits` | 自动 |
| L3 放行 | 正式笔记 + 原件归档 | 正式库 / 该领域`原始资料` / `99-Archive` | 人工 |

# 三层架构

## 第一层：清洗层（全自动 · 定时触发）

- 扫描 `00-Inbox/Downloaded`，只处理**尚未清洗或未标记 processed** 的真实资料。
- 读取 html / docx / pdf / xlsx / md。
- 机械规范化：格式整理、表格/图片/代码块保护、敏感信息扫描、去重。
- 产出 `00-Inbox/Cleaned/<原名>--cleaned.md`（命名与 Import Guide 一致）。**不移动原件。**
- 写入状态标记（见下）。

## 第二层：提炼层（AI 生成候选 · 只产出清单）

- 读取 cleaned 副本，为每份生成**建议**：主领域、分类、置信度（low/medium/high）、来源、作者、日期、Topic 候选、链接候选、建议的笔记要点。
- 全部汇入 `待核验清单-YYYYMMDD.md`，作为人工放行的输入。
- **不在本层写入任何正式笔记文件**；建议内容以可编辑草稿文本内嵌于清单，放行时才实例化。
- AI 生成的内容一律标注为"AI 建议"，与原文事实明确分离（禁止 AI 向原文注入事实）。

## 第三层：放行层（人工 · 保底阀门）

- 用户批量浏览待核验清单。
- 放行 → 按清单分配唯一 id、写入受控 YAML、移入正式位（01-Notes / 04-Research 对应子目录 / 89-Prompts/AI工具使用），原件归档到该领域`原始资料/`。
- 拒绝 → `99-Archive`。
- 来源不可溯 / 版权风险 / 敏感 → 保持 Downloaded 并标记，不强清洗、不放行。

# 状态标记机制（解决"重复处理"）

每个 cleaned 文件 frontmatter 记录：

- `workflow/status`：`waiting-approval` / `approved` / `rejected` / `archived` / `error`
- `workflow/processed: true`、`workflow/cleaned-at`

定时任务只处理 Downloaded 中"尚未生成对应 cleaned 副本或未标记 processed"的文件。

# 去重规则

- 主键：原始 URL（html 的 canonical/原始 URL）。
- 无 URL：标题规范化（去空格/标点）+ 文件哈希兜底。
- 去重范围：本批 Downloaded + 既有 Cleaned + 已入库索引。
- 同名不同哈希：判为"疑似重复"，记入待核验清单，不自动丢弃。

# 单文件失败处理

- 失败文件保留原样，frontmatter `workflow/status: error` + 错误信息。
- 同批最多重试 1 次；不阻塞整批。
- 批次报告汇总失败清单。

# 敏感信息扫描

- 模式白名单：邮箱、手机号、身份证、银行卡、Token、API Key、私钥、Cookie。
- 命中：标 `quality/sensitive` + 建议 low；正文可留在本地库，但放行时提醒"入库到生产目录前需处理"。
- 命中敏感信息的文件一律不放行。

# 报告保留策略

- 待核验清单滚动保留最近 30 份（或手动归档）。
- `96-System/Audits` 批次处理报告按 `audit/type: inbox-pipeline` 标记，滚动保留最近 30 份或按季度归档。

# 触发频率与空闲期

- 默认每日一次（如 08:00）。
- Downloaded 为空：跳过并记录日志，不空跑。

# 附件处理（放行时）

- 图片/附件随主文件迁移；移动时同步更新内部链接，保证清洗副本可读。
- 附件策略遵循 Folder Responsibilities（00-Inbox/Attachments / 正式附件策略）。

# 元数据与唯一 ID

- 正式入库时按 Metadata Schema 分配唯一 `id` 与受控 YAML。
- cleaned 暂存阶段不分配正式 id，避免污染 id 池。

# 阶段化准入门禁

自动化分两档：

- **档 1（本次方案范围）**：清洗 + 待核验清单 + 人工放行。自动化 Cleaner 必须先通过幂等测试 + 信息无损测试（当前 NOT_CHECKED），在小规模监督试点通过后，方可放开批量。
- **档 2（暂不启用）**：完全无人值守的自动归位。与现有 Triage / 人工验收治理冲突；除非用户明确改写治理规则，否则不启用。

# 技术实现

- 触发：Codex 定时自动化（需该功能可用且线程存活）。
- 执行：PowerShell + 内置 Python（复用已验证的中文路径 / base64 方案）。
- 输出：每批处理报告到 `96-System/Audits`。

# 范围界定

- 仅处理 Downloaded 中未处理真实资料。
- 版权 / 敏感 / 来源不可溯：保持 Downloaded 并标记。

# 待第二轮评审焦点

- 定时自动化是否可用、静默失败风险。
- "自动清洗"写副本是否需用户显式确认开启。
- LLM 提炼层的幻觉与来源分离是否足够严格。
- 附件迁移与链接一致性。
- 低置信度兜底与准入门禁是否足够。

