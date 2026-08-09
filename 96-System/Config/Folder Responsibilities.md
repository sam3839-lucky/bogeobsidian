# Folder Responsibilities

目录仅在出现真实内容时创建。下表定义职责，不代表所有路径已经物理存在。

| 目录 | 存放什么 | 不存放什么 | 内容从哪里进入 | 下一步去哪里 | 归档条件 |
|---|---|---|---|---|---|
| `00-Inbox` | 尚未判断类型的快速捕获 | 已整理的长期知识、正式草稿 | 手工记录、剪藏、移动端输入 | `Downloaded`、`Cleaned` 或对应主目录 | 处理完成后清空；不作为长期仓库 |
| `00-Inbox/Attachments` | 尚未归属笔记的临时附件 | 已绑定正式笔记的长期附件 | 截图、录音、临时图片 | 随主笔记进入其正式附件策略 | 已归属、重复或确认无价值时处理 |
| `00-Inbox/Downloaded` | 未审阅的下载资料 | 已提炼知识、已确认发布稿 | 浏览器、邮件、外部下载 | `Cleaned` 或 `04-Research` | 完成审阅与去重后离开 |
| `00-Inbox/Cleaned` | 已清洗但尚未正式归类的内容 | 原始下载、最终知识笔记 | Inbox 清洗流程 | `01-Notes`、`04-Research`、`05-Content` 或 `06-Projects` | 完成正式归类后离开 |
| `01-Notes` | 已提炼、可独立复用的知识笔记 | 原始资料、项目执行清单、发布副本 | Inbox、研究提炼、项目复盘 | Topic 链接、项目引用、内容创作 | 失效且无历史价值时进入 `99-Archive` |
| `04-Research` | 有研究问题、证据和结论的研究工作 | 泛化收件箱、纯发布稿 | `00-Inbox/Cleaned`、项目研究需求 | `01-Notes`、`06-Projects`、`05-Content` | 研究结束且不再活跃时归档 |
| `04-Research/AI` | AI 领域的研究材料与分析 | 房地产、教育或泛用笔记 | AI 资料与研究任务 | Notes、Projects、Content | 研究失效或项目结束 |
| `04-Research/房地产` | 房地产领域的研究材料与分析 | AI、教育或客户隐私凭据 | 房地产资料与研究任务 | Notes、Projects、Content | 研究失效或项目结束 |
| `04-Research/小孩教育` | 小孩教育领域的研究材料与分析 | 与研究无关的私人原始记录 | 教育资料与研究任务 | Notes、Projects、Content | 研究失效或项目结束 |
| `05-Content` | 内容生产过程与发布记录 | 研究原件的重复副本 | Notes、Research、Projects | Ideas、Briefs、Drafts、Scripts、Published | 内容停用后进入 `99-Archive` |
| `05-Content/Ideas` | 尚未承诺制作的选题 | 完整草稿、发布成品副本 | 日常捕获、研究洞察 | `Briefs` 或放弃 | 明确放弃或长期无价值 |
| `05-Content/Briefs` | 已筛选选题的受众、角度和证据需求 | 完整正文、视频工程文件 | Ideas、项目需求 | `Drafts` 或 `Scripts` | 取消制作或内容发布后按需归档 |
| `05-Content/Drafts` | 图文母稿及修订中的正文 | 多平台重复副本 | Briefs、Notes、Research | Published 或 Scripts | 发布完成且无需继续迭代 |
| `05-Content/Scripts` | 口播、视频、音频脚本 | 视频二进制工程和无关附件 | Briefs、Drafts | Published | 发布完成且无需继续迭代 |
| `05-Content/Published` | 发布记录、链接、日期和效果复盘 | 重复保存各平台相同正文 | Drafts、Scripts | 复盘进入 Notes 或 Archive | 停止追踪且复盘完成 |
| `06-Projects` | 有目标、期限、责任与交付物的项目材料 | 永久领域资料、无期限主题集合 | 研究需求、内容计划、真实任务 | Notes、Content 或 Archive | 目标完成、取消或长期冻结 |
| `07-Topics` | 基于真实笔记形成的主题导航页 | 原始资料和正文副本 | Notes、Research、Projects 的链接 | 持续维护导航 | 主题失效或不再有导航价值 |
| `89-Prompts` | 已验证、可复用且无凭据的提示词 | 未测试片段、账号信息、API Key | 实际 AI 工作流验证 | Templates、AI Context 或继续迭代 | 模型或流程变化导致失效 |
| `90-Templates` | 稳定的笔记和工作流模板 | 具体业务内容、未验证草稿 | 元数据规范与重复工作流 | 创建新笔记时实例化 | 被新模板替代且完成迁移 |
| `96-System` | 知识库治理、配置、审计和日志 | 业务知识正文、私人凭据 | 架构与运维过程 | Guides、Audits、Config、Logs | 通常不归档；废弃规则保留决策记录 |
| `96-System/Guides` | 可执行的使用指南和流程说明 | 配置源数据、流水日志 | 已接受的治理方案 | 指导日常操作 | 被新版指南取代时保留变更记录 |
| `96-System/Audits` | 有保留价值的结构、质量和安全审计 | 日常知识正文 | 定期或专项审计 | Config 决策、整改项目 | 风险关闭且超出保留期 |
| `96-System/Config` | ADR、目录职责、后续元数据与命名规范 | 临时讨论、业务正文 | 已确认的治理决策 | Guides、Templates、自动化规则 | 被替代时通过 ADR 标记，不直接删除 |
| `96-System/Logs` | 阶段状态和可验证变更记录 | 长篇研究和私人日记 | 每次受控变更 | 下一阶段准入与审计 | 按保留策略滚动，不擅自删除 |
| `97-AI-Memory` | 经批准、脱敏、适合长期复用的 AI 记忆 | Token、密码、Cookie、未授权隐私 | 用户明确确认的稳定事实 | AI Context 或工作流调用 | 事实失效、撤回授权或超出保留期 |
| `98-AI-Context` | 面向具体任务的可审计上下文包 | 无边界的全库复制、长期秘密 | Notes、Research、Projects 的选择性汇总 | AI 任务输入、项目产出 | 任务结束且无复用价值 |
| `99-Archive` | 已完成、停用或失效但需保留的内容 | 活跃工作、未处理 Inbox | Notes、Research、Content、Projects 等 | 只读参考或受控恢复 | 达到明确删除策略前持续保留 |

## 执行约束

- 不得为了“看起来完整”创建空目录。
- 新目录必须同时有首个真实文件或明确的即时工作用途。
- 同一文件只能有一个主存放位置；其他关系使用链接和后续元数据。
- 删除、批量移动、批量重命名必须单独展示影响并获得确认。