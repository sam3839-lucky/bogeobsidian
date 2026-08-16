/**
 * 知识库只读体检脚本 (Knowledge Base Health Check)
 * 
 * 版本: 2026-08-14-v1
 * 用途: 扫描 Vault 内所有 Markdown 文件，检查元数据合规性
 * 用法: node kb-health-check.js [vault_path]
 * 输出: 96-System/Audits/kb-health-check-<YYYYMMDD>.md
 */

const fs = require("fs");
const path = require("path");

const REGISTERED_TYPES = [
  "research", "source", "atomic-note", "daily-note", "project",
  "decision", "prompt", "content-brief", "content-task", "viral-design",
  "script", "topic-hub", "ai-memory", "audit-report"
];

const READONLY_COMPAT_TYPES = [
  "topic-candidates", "guide", "cleaned", "plan"
];

const ALL_VALID_TYPES = [...REGISTERED_TYPES, ...READONLY_COMPAT_TYPES];

const STATUS_COMPAT = {
  "research":       ["draft", "active", "completed", "archived"],
  "source":         ["draft", "active", "completed", "archived"],
  "atomic-note":    ["draft", "active", "deprecated", "archived"],
  "daily-note":     ["active", "completed", "archived"],
  "project":        ["planned", "active", "blocked", "paused", "completed", "archived"],
  "decision":       ["proposed", "accepted", "rejected", "superseded"],
  "prompt":         ["draft", "active", "deprecated", "archived"],
  "content-brief":  ["idea", "brief", "draft", "review", "published", "repurpose", "archived"],
  "content-task":   ["active", "blocked", "completed", "archived"],
  "viral-design":   ["draft", "review", "approved", "archived"],
  "script":         ["draft", "review", "ready", "published", "skipped", "archived"],
  "topic-hub":      ["active", "deprecated", "archived"],
  "ai-memory":      ["draft", "active", "deprecated", "archived"],
  "audit-report":   ["draft", "completed", "archived"],
  "topic-candidates": ["draft", "active", "completed", "archived"],
  "guide":           ["draft", "active", "completed", "archived"],
  "cleaned":         ["draft", "active", "completed", "archived"],
  "plan":            ["draft", "active", "completed", "archived"]
};

const VALID_DOMAINS = ["AI", "\u623f\u5730\u4ea7", "\u8d22\u5546", "\u5c0f\u5b69\u6559\u80b2", ""];
const VALID_CONFIDENCE = ["low", "medium", "high", "verified", ""];
const REQUIRED_FIELDS = ["id", "type", "title", "status", "created"];

function isExcludedPath(filePath) {
  // 00-Inbox: files not yet processed, skip all checks
  if (filePath.startsWith("00-Inbox" + path.sep) || filePath.startsWith("00-Inbox/")) return true;
  return false;
}

function isRawMaterialPath(filePath) {
  return filePath.includes(path.sep + "原始资料" + path.sep) || filePath.includes("/原始资料/");
}


function parseFrontmatter(content) {
  const match = content.match(/^---[\s\S]*?\n---/);
  if (!match) return null;
  const fmText = match[0];
  const fm = {};
  const lines = fmText.split("\n");
  for (let i = 1; i < lines.length - 1; i++) {
    const line = lines[i];
    const m = line.match(/^(\w+):\s*(.+?)(?:\s*#.*)?$/);
    if (m) {
      let value = m[2].trim();
      if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value.slice(1, -1).split(",").map(function(s) { return s.trim().replace(/['"]/g, ""); });
      }
      fm[m[1]] = value;
    }
  }
  return fm;
}

function scanVault(vaultPath) {
  var results = [];
  function walk(dir) {
    var entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    for (var ei = 0; ei < entries.length; ei++) {
      var entry = entries[ei];
      var fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith(".") && entry.name !== ".obsidian") continue;
        if (entry.name === "node_modules") continue;
        if (entry.name === "90-Templates") continue;
        walk(fullPath);
      } else if (entry.name.endsWith(".md")) {
        var relPath = path.relative(vaultPath, fullPath);
        var raw = "";
        try { raw = fs.readFileSync(fullPath, "utf-8"); } catch (e) { raw = ""; }
        var fm = parseFrontmatter(raw);
        results.push({ path: relPath, fullPath: fullPath, fm: fm });
      }
    }
  }
  walk(vaultPath);
  return results;
}

function checkType(file) {
  if (!file.fm) return null;
  var type = file.fm.type;
  if (!type) return null;
  if (READONLY_COMPAT_TYPES.indexOf(type) >= 0) {
    return { severity: "P2", check: "type", detail: "\u53ea\u8bfb\u517c\u5bb9\u7c7b\u578b \"" + type + "\"\uff0c\u65b0\u7b14\u8bb0\u7981\u6b62\u4f7f\u7528" };
  }
  if (REGISTERED_TYPES.indexOf(type) < 0) {
    return { severity: "P1", check: "type", detail: "\u672a\u6ce8\u518c\u7c7b\u578b \"" + type + "\"", suggestion: "\u8bf7\u5728 Metadata Schema \u4e2d\u6ce8\u518c\u6b64\u7c7b\u578b\uff0c\u6216\u4fee\u6b63\u4e3a\u5df2\u6ce8\u518c\u7c7b\u578b" };
  }
  return null;
}

function checkStatus(file) {
  if (!file.fm) return null;
  var type = file.fm.type;
  var status = file.fm.status;
  if (!type || !status) return null;
  var allowed = STATUS_COMPAT[type];
  if (!allowed) return null;
  if (allowed.indexOf(status) < 0) {
    return { severity: "P1", check: "status", detail: "type \"" + type + "\" \u4e0d\u5141\u8bb8 status \"" + status + "\"", suggestion: "\u5141\u8bb8\u7684\u503c: " + allowed.join(", ") };
  }
  return null;
}

function checkDuplicateIds(files) {
  var idMap = new Map();
  var issues = [];
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (!file.fm || !file.fm.id) continue;
    var id = file.fm.id;
    if (!idMap.has(id)) idMap.set(id, []);
    idMap.get(id).push(file.path);
  }
  idMap.forEach(function(paths, id) {
    if (paths.length > 1) {
      issues.push({ severity: "P0", check: "duplicate-id", detail: "ID \"" + id + "\" \u91cd\u590d " + paths.length + " \u6b21", files: paths, suggestion: "\u6bcf\u4e2a ID \u5fc5\u987b\u552f\u4e00\uff0c\u8bf7\u4fee\u6539\u91cd\u590d\u7684 ID" });
    }
  });
  return issues;
}

function checkRequiredFields(file) {
  var issues = [];
  if (!file.fm) return issues;
  // Skip required-fields check for Inbox and raw material files
  if (isExcludedPath(file.path)) return issues;
  if (isRawMaterialPath(file.path)) return issues;
  for (var i = 0; i < REQUIRED_FIELDS.length; i++) {
    var field = REQUIRED_FIELDS[i];
    var val = file.fm[field];
    if (!val || (Array.isArray(val) && val.length === 0)) {
      issues.push({ severity: "P2", check: "missing-field", detail: "\u7f3a\u5c11\u5fc5\u586b\u5b57\u6bb5 \"" + field + "\"", suggestion: "\u8bf7\u8865\u5145\u6b64\u5b57\u6bb5" });
    }
  }
  return issues;
}

function checkDomain(file) {
  if (!file.fm) return null;
  var domain = file.fm.domain;
  if (domain === undefined || domain === null) return null;
  if (VALID_DOMAINS.indexOf(domain) < 0) {
    return { severity: "P1", check: "domain", detail: "domain \"" + domain + "\" \u4e0d\u5728\u53d7\u63a7\u5217\u8868\u4e2d", suggestion: "\u5141\u8bb8\u7684\u503c: AI, \u623f\u5730\u4ea7, \u8d22\u5546, \u5c0f\u5b69\u6559\u80b2 \u6216\u7a7a\u5b57\u7b26\u4e32" };
  }
  return null;
}

function checkConfidence(file) {
  if (!file.fm) return null;
  var confidence = file.fm.confidence;
  if (confidence === undefined || confidence === null) return null;
  if (VALID_CONFIDENCE.indexOf(confidence) < 0) {
    return { severity: "P1", check: "confidence", detail: "confidence \"" + confidence + "\" \u4e0d\u5728\u53d7\u63a7\u5217\u8868\u4e2d", suggestion: "\u5141\u8bb8\u7684\u503c: low, medium, high, verified \u6216\u7a7a\u5b57\u7b26\u4e32" };
  }
  return null;
}

function checkSourceUrl(file) {
  if (!file.fm) return null;
  var url = file.fm.source_url;
  if (!url || url === "") return null;
  if (typeof url === "string" && !url.startsWith("http://") && !url.startsWith("https://")) {
    return { severity: "P2", check: "source_url", detail: "source_url \"" + url + "\" \u683c\u5f0f\u4e0d\u5408\u6cd5", suggestion: "\u8bf7\u4f7f\u7528\u5b8c\u6574\u7684 http:// \u6216 https:// \u5730\u5740" };
  }
  return null;
}

function checkViralDesignStatus(file) {
  if (!file.fm) return null;
  if (file.fm.type !== "viral-design") return null;
  if (!file.fm.status || file.fm.status === "") {
    return { severity: "P1", check: "viral-design-status", detail: "viral-design \u6587\u4ef6\u7f3a\u5c11 status \u5b57\u6bb5", suggestion: "\u5141\u8bb8\u7684\u503c: " + STATUS_COMPAT["viral-design"].join(", ") };
  }
  return null;
}

function main() {
  var vaultPath = process.argv[2] || path.resolve(__dirname, "..", "..");
  console.log("\u626b\u63cf\u8def\u5f84: " + vaultPath);
  console.log("");
  if (!fs.existsSync(vaultPath)) {
    console.error("\u9519\u8bef: \u8def\u5f84\u4e0d\u5b58\u5728 - " + vaultPath);
    process.exit(1);
  }
  var files = scanVault(vaultPath);
  var filesWithFM = files.filter(function(f) { return f.fm !== null; });
  console.log("\u603b\u6587\u4ef6\u6570: " + files.length);
  console.log("\u542b Frontmatter \u6587\u4ef6\u6570: " + filesWithFM.length);
  console.log("");
  var allIssues = [];
  for (var i = 0; i < filesWithFM.length; i++) {
    var file = filesWithFM[i];
    // Skip Inbox files entirely from all checks
    if (isExcludedPath(file.path)) continue;
    var checks = [checkType(file), checkStatus(file), checkDomain(file), checkConfidence(file), checkSourceUrl(file), checkViralDesignStatus(file)];
    checks = checks.concat(checkRequiredFields(file));
    for (var j = 0; j < checks.length; j++) {
      if (checks[j]) {
        var issue = checks[j];
        issue.file = file.path;
        allIssues.push(issue);
      }
    }
  }
  allIssues = allIssues.concat(checkDuplicateIds(filesWithFM));
  var p0 = allIssues.filter(function(i) { return i.severity === "P0"; });
  var p1 = allIssues.filter(function(i) { return i.severity === "P1"; });
  var p2 = allIssues.filter(function(i) { return i.severity === "P2"; });
  var byFile = new Map();
  for (var k = 0; k < allIssues.length; k++) {
    var iss = allIssues[k];
    var key = iss.file || "(\u5168\u5c40)";
    if (!byFile.has(key)) byFile.set(key, []);
    byFile.get(key).push(iss);
  }
  var now = new Date();
  var dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  var reportPath = path.join(vaultPath, "96-System", "Audits", "kb-health-check-" + dateStr + ".md");
  var lines = [];
  lines.push("# \u77e5\u8bc6\u5e93\u4f53\u68c0\u62a5\u544a");
  lines.push("");
  lines.push("- **\u68c0\u67e5\u65e5\u671f**: " + now.toISOString().slice(0, 10));
  lines.push("- **\u626b\u63cf\u8303\u56f4**: " + vaultPath);
  lines.push("- **\u603b\u6587\u4ef6\u6570**: " + files.length);
  lines.push("- **\u542b Frontmatter \u6587\u4ef6\u6570**: " + filesWithFM.length);
  lines.push("- **\u53d1\u73b0\u95ee\u9898\u603b\u6570**: " + allIssues.length + " (P0: " + p0.length + ", P1: " + p1.length + ", P2: " + p2.length + ")");
  lines.push("");
  lines.push("## \u6458\u8981");
  lines.push("");
  if (allIssues.length === 0) {
    lines.push("\u2705 \u672a\u53d1\u73b0\u95ee\u9898\uff0c\u77e5\u8bc6\u5e93\u5143\u6570\u636e\u5065\u5eb7\u3002");
  } else {
    if (p0.length > 0) {
      lines.push("### \ud83d\udd34 P0 \u963b\u585e (" + p0.length + ")");
      lines.push("");
      for (var pi = 0; pi < p0.length; pi++) {
        lines.push("- **" + (p0[pi].file || "(\u5168\u5c40)") + "**: " + p0[pi].detail);
      }
      lines.push("");
    }
    if (p1.length > 0) {
      lines.push("### \ud83d\udfe1 P1 \u9700\u5904\u7406 (" + p1.length + ")");
      lines.push("");
      for (var qi = 0; qi < p1.length; qi++) {
        lines.push("- **" + (p1[qi].file || "(\u5168\u5c40)") + "**: " + p1[qi].detail);
      }
      lines.push("");
    }
    if (p2.length > 0) {
      lines.push("### \ud83d\udd35 P2 \u5efa\u8bae (" + p2.length + ")");
      lines.push("");
      for (var ri = 0; ri < p2.length; ri++) {
        lines.push("- **" + (p2[ri].file || "(\u5168\u5c40)") + "**: " + p2[ri].detail);
      }
      lines.push("");
    }
  }
  lines.push("## \u8be6\u7ec6\u7ed3\u679c");
  lines.push("");
  if (allIssues.length === 0) {
    lines.push("\u65e0\u95ee\u9898\u3002");
  } else {
    byFile.forEach(function(issues, file) {
      lines.push("### " + file);
      lines.push("");
      for (var si = 0; si < issues.length; si++) {
        var issue = issues[si];
        lines.push("- **[" + issue.severity + "] " + issue.check + "**: " + issue.detail);
        if (issue.suggestion) lines.push("  - \u5efa\u8bae: " + issue.suggestion);
        if (issue.files) {
          lines.push("  - \u6d89\u53ca\u6587\u4ef6:");
          for (var ti = 0; ti < issue.files.length; ti++) {
            lines.push("    - " + issue.files[ti]);
          }
        }
      }
      lines.push("");
    });
  }
  lines.push("## \u5efa\u8bae\u64cd\u4f5c");
  lines.push("");
  lines.push("1. **P0 \u95ee\u9898**: \u4ec5\u91cd\u590d ID \u5c5e\u4e8e\u963b\u585e\uff0c\u5fc5\u987b\u7acb\u5373\u4fee\u590d\u3002");
  lines.push("2. **P1 \u95ee\u9898**: \u9010\u9879\u4fee\u590d\u4e0d\u5408\u89c4\u7684 type\u3001status\u3001domain\u3001confidence \u503c\u3002");
  lines.push("3. **P2 \u95ee\u9898**: \u5b58\u91cf\u6587\u4ef6\u7f3a\u5c11\u5143\u6570\u636e\u5c5e\u4e8e\u6b63\u5e38\u72b6\u6001\uff0c\u5728\u4e0b\u6b21\u7f16\u8f91\u76f8\u5173\u6587\u4ef6\u65f6\u987a\u4fbf\u8865\u5145\u3002Inbox \u548c\u539f\u59cb\u8d44\u6599\u6587\u4ef6\u7f3a\u5c11 YAML \u5c5e\u4e8e\u6b63\u5e38\u72b6\u6001\uff0c\u53ef\u5ffd\u7565\u3002");
  lines.push("4. **00-Inbox \u6587\u4ef6**: Inbox \u4e2d\u7684\u6587\u4ef6\u5c1a\u672a\u7ecf\u8fc7\u6e05\u6d17\u5f52\u4f4d\uff0c\u7f3a\u5931 YAML \u5c5e\u4e8e\u6b63\u5e38\u72b6\u6001\uff0c\u53ef\u5ffd\u7565\u3002");
  lines.push("5. **\u539f\u59cb\u8d44\u6599\u6587\u4ef6**: 04-Research/*/\u539f\u59cb\u8d44\u6599/ \u4e0b\u7684\u6587\u4ef6\u4e3a\u672a\u5904\u7406\u539f\u4ef6\uff0c\u7f3a\u5931 YAML \u5c5e\u4e8e\u6b63\u5e38\u72b6\u6001\uff0c\u53ef\u5ffd\u7565\u3002");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("*\u62a5\u544a\u7531 kb-health-check.js \u81ea\u52a8\u751f\u6210\uff0c\u8fd0\u884c\u65f6\u95f4: " + now.toISOString() + "*");
  var reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportPath, lines.join("\n"), "utf-8");
  console.log("\u62a5\u544a\u5df2\u4fdd\u5b58: " + reportPath);
  process.exit(p0.length > 0 ? 1 : 0);
}
main();