# 2026-08-10 - Stage 5 Metadata Governance Repair

## 范围

- 状态：UPDATED。
- 处理文件：3 份旧 Research 文档。
- 未处理文件：最后一份消费政策资料；保持 `domain: ""`。
- Vault 外备份：`E:\Obsidian-Backups\Stage5-MetadataRepair-20260810-142156`。

## 变更

- 补充唯一 `id`：3/3。
- 补充 `created`、`updated`、`topics`、`source`、`source_url`、`author`、`published_at`、`confidence`、`aliases`、`related`。
- 补充主领域 `domain: 房地产`：2 份原本为空的房地产研究文档；原本已有的房地产领域保持。
- 将非法 `status: collecting` 映射为 `draft`，理由是该文件仍处于资料收集阶段。
- 将未注册的 `research/*`、`location/*`、`source/*` 标签替换为已注册的 `workflow/review` 和 `quality/needs-verification`。
- 保留原有 `period`、`location`、`scope`、`source_scope` 信息，避免丢失上下文。

## 验证

- 3/3 ID 格式合法且唯一。
- 3/3 `type: research` 合法。
- 3/3 状态值受控。
- 3/3 标签全部注册。
- 3/3 正文哈希与备份一致。
- 未执行移动、删除、Git add、commit 或 push。

## 风险

- 最后一份消费政策仍位于 `04-Research/房地产` 但 `domain` 为空，这是用户确认保留的目录与元数据不一致。
- 3 份旧 Research 的 `source_url` 保持空值，因为来源链接较多且已保留在正文中；`source` 已补充为来源机构或多来源说明。
