# Project Management Guide

## 项目准入

只有同时满足以下条件的真实事项才进入 `06-Projects/<项目名>/`：

1. 有明确、可验证的项目目标。
2. 有成功标准。
3. 有完成、取消或归档的结束条件。

仅有兴趣、长期关注方向或零散待办的事项，不建立为 Project；分别进入 Topic、Research、Inbox 或普通任务系统。

## 项目最小文件集

每个获准项目至少包含：

- `Project-Status.md`：由 `Project Template.md` 实例化，作为唯一状态源。
- `Decisions.md`：决策索引，具体关键决策使用 Decision 模板并链接。
- `Resources.md`：资源索引，只链接真实资料，不复制 Research 或 Notes。

当前没有通过准入的真实项目，因此阶段 6 不创建 `06-Projects` 或示例项目目录。

## 状态规则

`planned → active → completed → archived` 是正常路径。发生外部阻塞时使用 `blocked`；主动暂缓且没有外部阻塞时使用 `paused`。状态恢复后回到 `active`。取消项目时在状态页记录原因，再根据保留价值进入 `archived`。

## 更新节奏

- 每次有效推进后更新已完成事项、待办和下一步行动。
- 状态变化时同步更新风险、阻塞与最后更新时间。
- 关键取舍写入 Decision，不只留在聊天或待办列表中。
- 资源只登记链接、用途和核验状态，不复制原始知识文件。

## 完成验收

项目只有在成功标准有证据、遗留事项已处理、关键决策可追溯且资源可访问时才能标记 `completed`。`archived` 表示停止活跃维护，不等同于成功完成。
