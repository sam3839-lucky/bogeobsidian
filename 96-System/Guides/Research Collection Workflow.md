# Research Collection Workflow

## 状态流

```text
外部资料
  → 00-Inbox/Downloaded
  → Triage（人工关卡）
  → Cleaner 生成新副本
  → 00-Inbox/Cleaned
  → 04-Research 或 01-Notes
  → 关联 Topic / Project
  → Reviewed（人工验收关卡）
  → 活跃使用或 99-Archive
```

## 各阶段定义

- **Downloaded**：未经处理的原始资料；保留原貌和来源。
- **Cleaned**：仅格式规范化，观点、事实与证据没有被改写。
- **Research**：已进入研究问题、证据、分析和结论体系的来源或研究记录。
- **Notes**：经过理解和提炼的原子知识，不是来源副本。
- **Archive**：仍需保留但不再活跃的资料。

## 关卡与责任

| 关卡 | 输入 | 必须验证 | 输出 |
|---|---|---|---|
| Import | 外部资料 | 合法性、来源、隐私、重复 | Downloaded 原件 |
| Triage | Downloaded | 安全、相关性、完整性、处理价值 | 清理/保留/归档建议 |
| Clean | 经批准原件 | 原件存在、格式规则、保护区 | Cleaned 副本 + 审查清单 |
| Classify | Cleaned | 主领域、topics、置信度 | Research/Notes 建议 |
| Link | 已分类内容 | 候选链接真实存在或明确待创建 | Topic/Project 关联建议 |
| Review | 全部产物 | 信息无损、建议已人工决策 | Reviewed 结果 |

## 单一主位置

原始资料和清理副本是可回滚链条中的不同工件，不是多分类复制。完成审查后，正式知识只有一个主存放位置；跨领域和跨项目关系使用链接与 Properties。

## 自动化边界

- 可自动：复制原件、格式清理、生成候选、输出差异和置信度。
- 不可自动：删除原件、删减观点、确认领域、创建 Topic Hub、移动到正式 Research、覆盖人工判断。
- 任何批量运行前必须先通过单文件人工试运行。