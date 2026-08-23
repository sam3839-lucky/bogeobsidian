---
id: "protocol-20260823-agent-knowledge-document-routing"
type: "protocol"
title: "Codex与Claude Code知识文档沉淀协议"
doc_type: "协议"
status: "active"
created: "2026-08-23"
updated: "2026-08-23"
project_key: "ai-agent-collaboration"
source_tool: "codex"
source_skill: "knowledge-base-docs"
confirmed_by: "user"
confirmed_at: "2026-08-23"
tags: ["Codex", "Claude Code", "GStack", "Grilling", "知识库"]
---
# Codex 与 Claude Code 知识文档沉淀协议

## 目标

让 Codex、Claude Code、GStack 和 Grilling 产生的知识型文档进入同一个 Obsidian Vault 项目区，同时保留代码仓库、GStack 内部状态和正式知识文档之间的边界。

## 唯一事实源

- Vault：`/Users/sam/bogeobsidian`
- 项目文档区：`/Users/sam/bogeobsidian/06-Projects/`
- 全局规则：`/Users/sam/.claude/AGENTS.md`
- 项目映射：`/Users/sam/.config/knowledge-base/project-map.yaml`
- 写入入口：`/Users/sam/.local/bin/kb-capture`

Codex 的 `~/.codex/AGENTS.md` 和 Claude Code 的 `~/.claude/CLAUDE.md` 最终读取同一套全局规则。知识库正式文档以 Vault 文件为准，代码和自动化测试以各自 Git 仓库为准。

## 数据流

```text
Codex / Claude Code
        │
        ├── GStack / Grilling 工作状态 → ~/.gstack/（内部状态）
        │
        └── 可读 Markdown 候选稿
                    │
                    ▼
             knowledge-base-docs
                    │
                    ▼
               kb-capture
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
   candidate 写入 Vault    blocked/conflict/error
          │                   │
          ▼                   ▼
    用户确认后 formal       必须报告失败
          │
          ▼
 Project-Status / Decisions / Resources（仅确认后更新）
```

## 捕获范围

应捕获：方案设计、产品设计、架构评审、UX/UI 评审、工程测试计划/报告、调查报告、复盘、决策和项目状态文档。

不捕获：源代码、自动化测试代码、GStack 的 JSONL/遥测/缓存/问题日志/恢复快照、构建产物、凭证和未经脱敏的敏感材料。

## 路由规则

每次捕获必须显式提供 `project_key`。`obsidian-kb` 默认对应 `content-production-dashboard`；Agent、Codex、Claude Code、GStack/Grilling 协议相关文档使用 `ai-agent-collaboration`。多个项目都可能适用时，先询问用户。

## 文档状态

新生成内容默认是 `candidate`，不等于审核通过。用户明确接受后才允许变更为 `formal`，再更新项目索引。任何 Agent 都不能把“生成成功”“写入成功”或“HTTP 成功”当成用户审批。

## 完成判定

- `written`：新文档已原子写入目标路径。
- `duplicate`：目标内容完全一致，未重复写入。
- `conflict`：目标文件存在但内容不同，不覆盖。
- `blocked`：检测到疑似密钥或高风险凭证，不写入。
- `invalid/error`：参数、项目目录、源文件或写入过程失败。

只有 `written` 或 `duplicate` 才能向用户报告 Vault 捕获完成，并且必须给出绝对路径。该协议不使用全局 Stop Hook，不把 `GSTACK_HOME` 指向 Vault，也不自动迁移历史 GStack 文档。
