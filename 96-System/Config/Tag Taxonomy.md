# Tag Taxonomy

## 原则

Tags 只表达少量跨目录、跨类型的操作性信号。领域使用 `domain`，主题使用 `topics`，生命周期使用 `status`；三者不得重复制造标签。

## 已注册标签

| 标签 | 用途 | 禁止替代 |
|---|---|---|
| `workflow/review` | 需要人工复核 | `status` |
| `workflow/follow-up` | 存在明确后续行动 | 项目任务系统 |
| `quality/needs-verification` | 事实或来源尚待核验 | `confidence` 的最终判断 |
| `attention/important` | 少量真正需要优先注意的内容 | 普通收藏 |
| `sensitivity/private` | 含授权保存但需谨慎处理的私人内容 | 凭据存储许可 |
| `format/longform` | 长文输出形态 | `type` |
| `format/shortform` | 短内容输出形态 | 平台目录 |
| `format/video` | 视频或口播输出形态 | 平台名称 |

## 格式规则

- YAML 中不带 `#`，例如 `tags: ["workflow/review"]`。
- 使用小写 ASCII、数字、连字符和最多一个 `/`。
- 不创建 `ai`、`房地产`、`小孩教育` 等领域标签。
- 不创建与 `draft`、`active`、`published` 等状态同义的标签。
- 不创建平台标签；本次平台字段未正式填写。
- 新标签必须先更新本文件，说明与现有字段为何不可替代。
- 临时一次性标记优先写正文任务，不进入全局分类法。