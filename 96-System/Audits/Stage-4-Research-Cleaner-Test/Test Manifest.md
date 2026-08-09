---
id: "audit-report-20260809-stage4-research-cleaner-test"
type: "audit-report"
title: "阶段 4 Research Cleaner 测试"
status: "completed"
created: "2026-08-09"
updated: "2026-08-09"
domain: ""
topics: ["知识库治理", "资料清洗"]
tags: []
source: "阶段 4 自有测试集"
source_url: ""
author: ""
published_at: ""
confidence: "verified"
aliases: []
related: ["[[Research Import Guide]]", "[[Research Triage Guide]]", "[[Research Collection Workflow]]", "[[Research Cleaner Specification]]", "[[Research Classification Rules]]"]
---

# 测试范围

6 个自编短样本，覆盖中文、英文、代码块、表格、图片链接和混乱标题层级。所有内容仅为测试，不代表真实研究结论。

## 输入与输出

- 输入：`Inputs`，视为只读原件。
- 输出：`Outputs`，为按 Cleaner Specification 手工生成的清理副本。
- 未使用真实 Research 内容。

## 测试结果

| 样本 | 输入与输出差异 | 信息丢失 | 来源字段 | 保护结构 | 标题层级 |
|---|---|---|---|---|---|
| 中文文章 | 标题层级、列表标记、空行 | 否 | 保留 | 引用与导航保留 | 通过 |
| 英文文章 | 标题层级、列表标记、空行 | 否 | 保留 | 不适用结构无变化 | 通过 |
| 代码块 | 标题层级、空行 | 否 | 保留 | 代码块逐字符一致 | 通过 |
| 表格 | 标题层级、空行 | 否 | 保留 | 表格行逐字符一致 | 通过 |
| 图片链接 | 标题层级、空行 | 否 | 保留 | 图片链接逐字符一致 | 通过 |
| 混乱标题 | 标题层级、空行 | 否 | 保留 | 不适用结构无变化 | 通过 |

汇总：6/6 通过；信息丢失 0；来源失败 0；保护结构失败 0；标题层级失败 0。

## 分类建议

以下均为规则或 AI 建议，不是原文事实，未写入 cleaned 正文。

| 样本 | 主领域建议 | Topic 候选 | 内部链接候选 | 置信度 |
|---|---|---|---|---|
| 中文文章 | AI | 知识管理、生成式 AI | [[Metadata Schema]]、[[Research Cleaner Specification]] | high |
| 英文文章 | 房地产 | 租赁市场、数据判断 | [[Research Classification Rules]] | medium |
| 代码块 | AI | Markdown 清洗、代码保护 | [[Research Cleaner Specification]] | high |
| 表格 | 房地产 | 租金数据、表格保护 | [[Research Classification Rules]] | high |
| 图片链接 | 小孩教育 | 儿童阅读、图片资产 | [[Research Import Guide]] | medium |
| 混乱标题 | 空 | Markdown 标题层级 | [[Naming Convention]] | low；必须标记 `quality/needs-verification` |

## 失败案例与边界

- 已覆盖样本失败数：0。
- 未覆盖：嵌套列表、脚注、复杂 HTML、损坏的代码围栏、数学公式、大型附件和 OCR 错误。
- 图片测试只验证 Markdown 链接保持一致，不验证远端图片可访问性。
- 当前没有可执行的自动化 Cleaner，因此自动幂等性测试为 NOT_CHECKED。
- 分类建议只验证规则一致性，没有用真实研究资料验证准确率。

## 真实试运行结论

- 单文件、人工监督、保留原件的真实试运行：VERIFIED。
- 自动化批量清洗：BLOCKED。
- 自动移动至 Research、Notes、Topic 或 Project：BLOCKED。
- 首次真实试运行必须逐项检查差异，并在任何保护区变化时停止。

## 回滚

使用 Git revert 撤销阶段 4 提交；不得 Force Push。