# Codex + OpenCodex 多模型配置部署手册(Windows)

> 用途:在任意 Windows 电脑上,为 Codex(App / CLI)接入 OpenCodex 本地代理,实现 GPT + DeepSeek + 火山方舟等多模型一键切换。
> 本文档基于 2026-08-12 在一台中文用户名 Windows 电脑上的**实测通过**流程整理,所有命令均已验证。
> 适用:Windows 10/11,已安装 Codex(官方 App 或 CLI)或 Claude Code。

---

## 0. 手册速览

| 章节 | 内容 | 耗时 |
|---|---|---|
| §1 前置条件 | 需要什么、装什么 | — |
| §2 安装 OpenCodex | 独立目录安装 + 路径陷阱 | 2 分钟 |
| §3 【重要】中文用户名编码修复 | **仅非英文用户名需要** | 5 分钟 |
| §4 启动与初始化 | 非交互初始化 + 启用 WebSocket | 2 分钟 |
| §5 注入验证与回退演练 | 确认配置安全可逆 | 5 分钟 |
| §6 配置第三方 Provider | 面板 / CLI 两种方式 | 3 分钟 |
| §7 日常使用与模型切换 | codex -m、/model、App | — |
| §8 开机自启 | 启动文件夹方案(规避官方 bug) | 2 分钟 |
| §9 备份与恢复 | 快照脚本 + 三层恢复 | 3 分钟 |
| §10 验收清单 | 配置成功的判定标准 | — |
| §11 常见问题 FAQ | 踩坑实录 | — |

---

## 1. 前置条件

| 项 | 要求 | 检查命令 |
|---|---|---|
| 操作系统 | Windows 10/11(x64) | — |
| Codex | 已安装官方 Codex App 或 CLI(`@openai/codex`) | `codex --version` |
| Node.js | ≥ 18(建议 22 LTS) | `node --version` |
| npm | ≥ 9 | `npm --version` |
| API Key | DeepSeek / 火山方舟 / 其他服务商的 key | — |

> 若 Codex CLI 不在 PATH:从 Codex App 的安装目录找 `codex.exe`(`%LOCALAPPDATA%\OpenAI\Codex\bin\<hash>\codex.exe`),或重新 `npm install -g @openai/codex`。

---

## 2. 安装 OpenCodex(独立目录)

OpenCodex 官方 npm 包:`@bitkyc08/opencodex`,安装后提供 `ocx` / `opencodex` 两个命令。

### 2.1 创建独立运行目录

**不要**用系统默认全局目录,单独建一个目录,便于升级与卸载:

```bash
mkdir -p "$HOME/opencodex-runtime"
```

### 2.2 安装(⚠️ Git Bash 路径陷阱)

> **踩坑实录**:在 Git Bash 中若直接 `npm install -g --prefix "$HOME/opencodex-runtime" ...`,npm(Windows 进程)会把 `/c/Users/xxx` 误解析为 `E:\c\Users\xxx`,装错位置。必须用 `cygpath` 转成 Windows 路径:

```bash
npm install -g --prefix "$(cygpath -w "$HOME/opencodex-runtime")" @bitkyc08/opencodex
```

- 若 npm 提示 `install-scripts ... blocked`(npm 11+ 行为),加 `--allow-scripts=bun` 重装;npm 10 默认不拦截,直接装即可。
- 包名必须写全,勿用 npm 警告里的缩写命令。

### 2.3 验证

```bash
export PATH="$HOME/opencodex-runtime:$PATH"
ocx --version      # 预期: opencodex x.y.z
opencodex --version
```

### 2.4 将目录加入 PATH(可选,方便以后直接用 ocx)

PowerShell(用户级,勿用 `setx PATH`——Git Bash 的 `$PATH` 是 POSIX 格式,会污染 Windows PATH):

```powershell
$bin = "$env:USERPROFILE\opencodex-runtime"
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($userPath -notlike "*$bin*") {
    [Environment]::SetEnvironmentVariable('Path', $userPath + ';' + $bin, 'User')
}
```

---

## 3. 【重要】中文/非 ASCII 用户名环境的编码修复

> **只在 Windows 用户名为中文或含非 ASCII 字符时执行**(如 `C:\Users\刘晓芳`)。纯英文用户名可跳过本节。

### 3.1 症状(不修复时的表现)

- `ocx start` 报:`Codex configuration was not written: ... The Windows coordinator namespace cannot be created.`
- 注入失败,config.toml 无 `openai_base_url`。

### 3.2 根因

opencodex 通过 PowerShell 子进程获取 `LocalAppData` 路径。PowerShell 5.1 重定向 stdout 时默认按 ASCII/GBK 编码,中文字符变成 `?`,路径 `C:\Users\???\AppData\Local` 无法创建,导致注入失败。

### 3.3 修复步骤(patch 源码)

找到安装目录下的源码文件:

```
<你的opencodex-runtime>/node_modules/@bitkyc08/opencodex/src/codex/user-identity.ts
```

**第 1 步:备份原文件**

```bash
cp <该路径>/user-identity.ts <该路径>/user-identity.ts.bak
```

**第 2 步:修改 `powershellValue` 函数**(约第 96 行起),强制 PowerShell 管道输出 UTF-8:

```diff
 function powershellValue(expression: string): string {
   let command: string[];
   try {
-    command = windowsIdentityPowerShellCommand(expression);
+    const utf8Bootstrap =
+      "[Console]::OutputEncoding=[System.Text.Encoding]::UTF8; " +
+      "$OutputEncoding=[System.Text.Encoding]::UTF8; ";
+    command = windowsIdentityPowerShellCommand(utf8Bootstrap + expression);
   } catch (cause) {
     refuse("Windows effective-account lookup could not start.", cause);
   }
```

**第 3 步:解码加 GBK 兜底**(同一个函数内,找到 `const value = new TextDecoder()...`):

```diff
-  const value = new TextDecoder().decode(result.stdout).trim();
+  let value = new TextDecoder().decode(result.stdout).trim();
+  if (value.includes("\uFFFD")) {
+    try { value = new TextDecoder("gbk").decode(result.stdout).trim(); } catch {}
+  }
   if (!value) refuse("Windows effective-account lookup returned an empty value.");
   return value;
```

**第 4 步:验证修复**

```bash
ocx start
grep openai_base_url ~/.codex/config.toml   # 应出现注入行
```

> ⚠️ **升级提醒**:`ocx update` 会覆盖此 patch,升级后需重新打。patch 文件备份在 `.bak`。

---

## 4. 启动代理与初始化(非交互)

`ocx init` 是**交互式向导**,不适合脚本化;改用非交互路径,效果相同:

```bash
export PATH="$HOME/opencodex-runtime:$PATH"
ocx start          # 首次启动:用默认配置(openai forward 透传),自动注入 Codex
ocx status         # 确认 Proxy running
```

**启用 WebSocket(必须,否则 codex 报 426 Upgrade Required):**

```bash
ocx config set websockets true
ocx restart
```

**验证:**

```bash
curl http://localhost:10100/healthz        # 预期 {"status":"ok",...}
ocx config show | grep websockets          # 预期 true
grep -nE "openai_base_url|model_catalog_json" ~/.codex/config.toml   # 预期 2 行注入
```

> 注入内容(带 `# Auto-injected by opencodex` 标记):
> - `openai_base_url = "http://127.0.0.1:10100/v1"`
> - `model_catalog_json = "C:\Users\<用户>\.codex\opencodex-catalog.json"`
>
> 注:`ocx start` 注入时会把 `service_tier` 临时从 `priority` 改为 `fast`(副作用),`ocx stop` 时会自动恢复,无需干预。

---

## 5. 注入验证与回退演练(建议做一次,确认安全可逆)

### 5.1 注入前快照

```bash
mkdir -p ~/.backup/codex
cp ~/.codex/config.toml ~/.backup/codex/before-config.toml
sha256sum ~/.codex/config.toml
```

### 5.2 注入后对比

```bash
cp ~/.codex/config.toml ~/.backup/codex/after-config.toml
diff ~/.backup/codex/before-config.toml ~/.backup/codex/after-config.toml
# 预期差异:恰好 model_catalog_json + openai_base_url 两行(及 service_tier 临时变化)
```

### 5.3 回退演练(验证可逆)

```bash
ocx stop
sha256sum ~/.codex/config.toml   # 应与 before 完全一致
diff ~/.backup/codex/before-config.toml ~/.codex/config.toml   # 预期无差异
ocx start                         # 恢复代理
```

> 通过此演练即证明:注入/回退完全可靠,任何时刻都能无损回到原生 Codex。

---

## 6. 配置第三方 Provider

### 6.1 方式一:Web 面板(推荐,图形化)

1. 浏览器打开 `http://localhost:10100`
2. Providers → 添加 → 搜索预设(DeepSeek / Volcengine Coding Plan / OpenRouter 等)
3. 填 API Key(粘贴字面值,或填 `${环境变量名}` 引用,推荐后者)
4. 保存即生效,无需重启

### 6.2 方式二:CLI(非交互)

```bash
ocx provider list                                    # 查看当前 provider
ocx provider add deepseek                            # 注册表预设按名添加(随后配置 key)
ocx config set ...                                  # 或用 ocx provider edit 配 key
```

### 6.3 常用 Provider 参数参考

| Provider | 预设名 | base URL | 认证 |
|---|---|---|---|
| DeepSeek | `deepseek` | `https://api.deepseek.com` | API Key(`DEEPSEEK_API_KEY`) |
| 火山方舟 Coding Plan | `volcengine-coding-plan` | `https://ark.cn-beijing.volces.com/api/coding/v3` | API Key(订阅配额) |
| 火山方舟按量 | `volcengine-ark` | `https://ark.cn-beijing.volces.com/api/v3` | API Key |
| OpenRouter | `openrouter` | `https://openrouter.ai/api/v1` | API Key |

> API Key 持久化(Windows,新终端生效):`setx DEEPSEEK_API_KEY "sk-xxx"`。**只对 key 用 setx,切勿用 setx 改 PATH。**

---

## 7. 日常使用与模型切换

```bash
codex -m "deepseek/deepseek-v4-flash" "写一个斐波那契函数"
codex -m "volcengine-coding-plan/ark-code-latest" "解释这段代码"
codex -m "gpt-5.6-terra" "..."            # 回原生 ChatGPT(透传)
```

- TUI 内输入 `/model` 弹模型选择器,一键切换。
- Codex App 顶部模型选择器同样可见路由模型(与原生 GPT 并列)。
- 模型路由优先级:显式 `provider/model` → provider 默认模型 → 内置前缀(`gpt-`/`claude-` 等)→ provider 模型列表 → 默认 provider。

> 在 Git Bash 中调用 codex CLI 注意:
> - `CODEX_HOME` 用 Windows 格式:`export CODEX_HOME="C:/Users/<用户>/.codex"`
> - 非 git 仓库目录运行需 `--skip-git-repo-check`

---

## 8. 开机自启

> **踩坑实录**:opencodex 官方 `ocx codex-shim install` 会因 codex 是真实 exe 而拒绝;`ocx service install` 在中文用户名环境下注册验证失败(上游 bug)。**推荐用下面的启动文件夹方案,简单可靠。**

### 8.1 推荐:启动文件夹方案

在 `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\` 下创建 `opencodex-autostart.cmd`:

```bat
@echo off
"%USERPROFILE%\opencodex-runtime\ocx.cmd" start
```

> - 保存编码用 **ANSI/GBK**(含中文用户名时);纯英文环境 UTF-8 亦可。
> - 开机登录后自动启动代理;无需计划任务、无需管理员。
> - 取消自启:删除该文件即可。

### 8.2 官方机制(可选,中文用户名下可能失败)

```bat
ocx tray install      % 系统托盘图标,一键启停
ocx service install   % 计划任务后台服务
```

---

## 9. 备份与恢复

### 9.1 备份范围

| 级别 | 内容 |
|---|---|
| 核心(必须) | `~/.codex/{config.toml, auth.json, AGENTS.md, .codex-global-state.json}` |
| 扩展(建议) | `~/.codex/{rules, skills, memories}/` |
| OpenCodex | `~/.opencodex/` 整体、`~/.codex/opencodex-catalog.json` |

### 9.2 快照命令(基线)

```bash
mkdir -p ~/.backup/codex
cp ~/.codex/config.toml ~/.backup/codex/config.toml.$(date +%Y%m%d_%H%M%S)
```

### 9.3 三层恢复

| 层 | 方法 | 场景 |
|---|---|---|
| L1 | `ocx stop` / `ocx restore` | 日常回退、代理异常 |
| L2 | 用备份覆盖 `~/.codex/config.toml` + 删除 `opencodex-catalog.json`/`opencodex.config.toml` | 精确回滚 |
| L3 | `npm uninstall -g --prefix "$(cygpath -w "$HOME/opencodex-runtime")" @bitkyc08/opencodex` + `rm -rf ~/.opencodex ~/opencodex-runtime` + L2 | 彻底卸载 |

> 恢复前先退出 Codex App,避免其基于内存覆盖 config.toml;`auth.json` 若快照后有重新登录,先备份当前副本。

---

## 10. 验收清单(配置成功的判定)

- [ ] `ocx status` 显示 Proxy running,端口 10100
- [ ] `curl http://localhost:10100/healthz` 返回 ok
- [ ] `grep openai_base_url ~/.codex/config.toml` 有注入行
- [ ] `ocx provider list` 显示目标 provider(deepseek / volcengine-coding-plan 等)
- [ ] `ocx models list` 能看到路由模型
- [ ] `codex -m "deepseek/<模型>" "回复OK"` 跑通,有输出
- [ ] `codex -m "gpt-5.6-terra" "回复OK"` 走透传(无网络错误;429 表示配额问题非配置问题)
- [ ] `ocx stop` 后 config.toml 与注入前指纹一致(回退无损)

---

## 11. 常见问题 FAQ(踩坑实录)

| 问题 | 原因 | 解决 |
|---|---|---|
| `426 Upgrade Required`(codex 报 websocket 失败) | WebSocket 默认关闭 | `ocx config set websockets true` + `ocx restart` |
| `The Windows coordinator namespace cannot be created` | 中文用户名 + PowerShell 输出编码 | 执行 §3 的 patch |
| 安装后 `ocx` 找不到 | PATH 未含 opencodex-runtime | `export PATH="$HOME/opencodex-runtime:$PATH"` 或加入 User PATH |
| npm 装到 `E:\c\Users\...` | Git Bash 路径被 Windows npm 误解析 | `--prefix "$(cygpath -w ...)"` |
| `CODEX_HOME points to /c/... does not exist` | Windows 程序不认 MSYS 路径 | `export CODEX_HOME="C:/Users/<用户>/.codex"` |
| `Not inside a trusted directory` | 非 git 仓库目录 | 加 `--skip-git-repo-check` |
| `service_tier` 被改成 fast | ocx 注入副作用 | 无需处理,`ocx stop` 自动恢复 |
| 请求返回 `usage limit` | ChatGPT 账号 Codex 配额耗尽 | 与配置无关,等配额恢复或用第三方模型 |
| 升级 ocx 后注入又失败 | patch 被覆盖 | 重新执行 §3 |

---

*本文档所有命令均在本机实测通过;执行前请先阅读对应章节的「踩坑实录」提示。*
