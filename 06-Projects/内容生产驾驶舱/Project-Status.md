---
id: "project-20260814-content-production-dashboard"
type: "project"
title: "内容生产驾驶舱"
status: "active"
created: "2026-08-13"
updated: "2026-08-15"
domain: "房地产"
topics: ["内容生产", "视频号选题", "公众号文案", "Obsidian 插件"]
tags: []
source: ""
source_url: ""
author: ""
published_at: ""
confidence: ""
aliases: ["驾驶舱项目", "Content Production Dashboard"]
related: ["[[2026-08-14 知识库驱动内容生产驾驶舱-产品设计方案]]", "[[2026-08-14 内容生产驾驶舱-MVP UX UI设计与评审]]"]
---
# 项目目标

把知识库驱动的选题与内容生产流程，固化为一个 Obsidian 插件「内容生产驾驶舱」：按已批准的设计交互（14 页 / 13 状态 / 3 条演示链）完成开发、测试并提交到 Git，实现效果与 MVP 原型一致。

## 成功标准

1. 界面与 MVP 原型（HTML）在颜色、字号、行距、布局上一致。
2. 14 个页面、13 种状态、3 条交互链均可正常导航与切换。
3. 单元测试（309 条）、ESLint、TypeScript 类型检查与构建全部通过。
4. 源码提交到 obsidian-kb 仓库。

## 结束条件

以下条件全部满足时标记 `completed`：

- 插件在真实 Obsidian 中由用户完成端到端点击验收；
- 明暗主题与窄分栏设计 QA（T4）完成；
- 元数据 ADR 登记 script / viral-design / content-task（T2）完成；
- 源码已提交并推送。

## 当前状态

`active`。MVP UI 已按设计实现并对齐原型（修复 CSS BOM 导致的样式失效），309 条单元测试与构建通过，本地提交已完成（HEAD 2acc564）。剩余：真实 Obsidian 端到端验收、T2 元数据 ADR、T4 主题 QA、推送远端。

## 已完成事项

- [x] 产品方案与 UX/UI 设计评审通过。
- [x] 工程架构评审与测试计划完成。
- [x] MVP UI 开发完成，与原型视觉对齐（修复 CSS BOM 根因）。
- [x] 单元测试 309 条通过；ESLint 零告警；类型检查 + 构建通过。
- [x] 浏览器端 E2E 验证：14 页导航、13 状态切换、3 条演示链步数正确。
- [x] 源码本地提交（obsidian-kb，2acc564）。

## 待办事项

- [ ] 用户在真实 Obsidian 中重新加载插件并完成端到端点击验收。
- [ ] 推送 3 个本地提交到远端（当前环境 git 被 dubious ownership 阻塞）。
- [ ] T2：元数据 ADR 登记 script / viral-design / content-task。
- [ ] T4：明暗主题与窄分栏设计 QA。

## 下一步行动

用户在 Obsidian 重载插件，确认界面与原型一致；随后推送本地提交。

## 风险

- 设计文档要求主题兼容（用 Obsidian 变量），但当前目标要求与深色原型一致，二者存在冲突，已选择硬编码，需用户确认。
- 端到端点击测试依赖真实 Obsidian 环境，当前自动化环境无法替代。

## 阻塞项

- 推送远端：当前运行环境对 `E:\obsidian-kb-v2-dev` 只读，Git 报 dubious ownership，需用户在正常终端执行 `git push origin main`。

## 关键决策

- 界面颜色硬编码为原型值（与主题兼容目标存在张力，待用户拍板）。
- 软件项目与内容工作流方法论分离：方法论归 `96-System/Guides`，软件归 `06-Projects`。

## 最后更新时间

2026-08-15
