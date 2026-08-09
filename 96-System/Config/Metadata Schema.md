# Metadata Schema

## 目标

所有新笔记使用英文 YAML 字段名、中文正文和受控值。现有笔记不批量注入 YAML。模板只使用 Obsidian 原生可解析的静态 YAML，不依赖插件。

## 基础字段

| 字段 | 类型 | 通用要求 | 说明 |
|---|---|---|---|
| `id` | string | 必填 | 稳定唯一标识，不随文件名或路径变化 |
| `type` | string | 必填 | 受控笔记类型 |
| `title` | string | 必填 | 人类可读标题，可与文件名不同 |
| `status` | string | 必填 | 按 `type` 使用兼容的受控状态 |
| `created` | date string | 必填 | `YYYY-MM-DD` |
| `updated` | date string | 可选 | 实质更新日期，`YYYY-MM-DD` |
| `domain` | string | 条件必填 | 最多一个主领域；研究笔记必须填写 |
| `topics` | list[string] | 可选 | 可多选，表达主题，不带 `#` |
| `tags` | list[string] | 可选 | 仅使用 Tag Taxonomy 注册值，不替代 topics |
| `source` | string | 条件必填 | 来源名称、书名、报告名或访谈名称 |
| `source_url` | string | 可选 | 原始 URL；存在时使用完整 `http` 或 `https` 地址 |
| `author` | string | 可选 | 仅在已知时填写，不推测 |
| `published_at` | date string | 可选 | 来源或内容发布日期，`YYYY-MM-DD` |
| `confidence` | string | 条件必填 | 对事实或结论可信度的受控判断 |
| `aliases` | list[string] | 可选 | 确有检索价值的别名 |
| `related` | list[string] | 可选 | Obsidian 内部链接字符串，如 `"[[笔记名]]"` |

空的可选字符串使用 `""`，空列表使用 `[]`。不得使用 `null`、虚构作者、虚构来源或自动猜测日期。

## `id` 规则

格式：`<type>-<YYYYMMDD>-<slug>`。

示例：`research-20260809-ai-agent-eval`。

- `type` 必须与 YAML `type` 一致。
- 日期是首次创建日期，不随文件重命名而变化。
- `slug` 使用小写 ASCII、数字和连字符。
- 创建实际笔记时必须检查 Vault 内没有重复 `id`。
- 模板中的空 `id` 不是有效笔记 ID，实例化后必须手工填写。

## 受控 `type`

- `research`
- `source`
- `atomic-note`
- `daily-note`
- `project`
- `decision`
- `prompt`
- `content-brief`
- `topic-hub`
- `ai-memory`
- `audit-report`

## `type` 与 `status` 兼容表

| type | 允许的 status |
|---|---|
| `research` | `draft`, `active`, `completed`, `archived` |
| `source` | `draft`, `active`, `completed`, `archived` |
| `atomic-note` | `draft`, `active`, `deprecated`, `archived` |
| `daily-note` | `active`, `completed`, `archived` |
| `project` | `draft`, `active`, `paused`, `completed`, `archived` |
| `decision` | `proposed`, `accepted`, `rejected`, `superseded` |
| `prompt` | `draft`, `active`, `deprecated`, `archived` |
| `content-brief` | `draft`, `active`, `paused`, `completed`, `published`, `archived` |
| `topic-hub` | `active`, `deprecated`, `archived` |
| `ai-memory` | `draft`, `active`, `deprecated`, `archived` |
| `audit-report` | `draft`, `completed`, `archived` |

## 受控领域与可信度

`domain` 仅允许空值或以下一个值：

- `AI`
- `房地产`
- `小孩教育`

跨领域笔记选择最主要的一个领域，其余放入 `topics`，不得复制文件。

`confidence` 仅允许空值或：

- `low`
- `medium`
- `high`
- `verified`

`verified` 表示已依据可追溯来源完成核验，不表示绝对正确。

## 类型特定要求

- `research`：`domain`、`confidence` 必填；有外部证据时填写 `source` 或 `source_url`。
- `source`：`source` 与 `source_url` 至少填写一个；`confidence` 必填。
- `atomic-note`：`confidence` 必填，正文只表达一个可复用观点。
- `daily-note`：文件名和 `title` 使用同一日期。
- `decision`：正文必须记录背景、决策、替代方案与影响。
- `prompt`：不得包含 Token、密码、Cookie、API Key 或私人数据。
- `content-brief`：平台尚未在本次配置中正式填写，平台信息暂写正文，不新增目录或 YAML 枚举。
- `topic-hub`：只有真实笔记达到导航需要时才实例化；本阶段不创建 Topic Hub。
- `ai-memory`：`source` 或 `related` 至少一个非空，`confidence` 必填；禁止凭据和未经授权隐私。
- `audit-report`：正文必须包含范围、证据、结论和阻塞项。

## 更新规则

- 仅内容或结论发生实质变化时更新 `updated`。
- 文件移动或重命名不得修改 `id`。
- 状态变化必须符合兼容表。
- 新增字段或受控值必须先修改本文件并记录 ADR。