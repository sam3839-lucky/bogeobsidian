# Research Triage Guide

## Triage 的性质

Triage 是人工判定关卡，不是目录，也不是 YAML `status`。它决定资料是否值得清理、研究、提炼或归档。

## 检查顺序

1. 安全：是否含凭据、未授权隐私或恶意内容。
2. 来源：标题、来源、作者、日期、URL 是否可追溯。
3. 重复：是否已有相同 URL、哈希或等价资料。
4. 相关性：是否与 AI、房地产、小孩教育或明确项目有关。
5. 可处理性：正文是否完整，格式是否适合清理。
6. 去向：Cleaned、Research、Notes、Archive 或保持 Downloaded。

## 去向判定

| 去向 | 条件 |
|---|---|
| `00-Inbox/Cleaned` | 格式已清理，原意未改变，等待分类或研究 |
| `04-Research` | 已有研究问题、证据需求或分析上下文 |
| `01-Notes` | 已经理解并提炼成单一、可复用知识，不是原文副本 |
| `99-Archive` | 需要保留但当前不活跃、重复或低优先级 |
| 保持 Downloaded | 来源不完整、安全或版权风险未解决 |

## Reviewed 关卡

Reviewed 是人工验收结果，不新增 `status: reviewed`。验收清单记录在审查报告或项目正文中：

- 原始文件仍可读取。
- 来源字段未丢失。
- 受保护结构未变化。
- 清理副本没有删减观点。
- AI 建议与原文事实明确分离。
- 分类与链接建议已由人确认或拒绝。

## 低置信度

分类置信度为 `low` 时，添加建议标签 `quality/needs-verification`，保持在 Cleaned 或 Downloaded，不自动进入正式 Research。