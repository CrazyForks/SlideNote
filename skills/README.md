# Skills - 技能说明

本目录包含 SlideNote 项目的各种技能脚本，用于自动化常见的开发和发布任务。

## 可用技能

### 📦 Release - 发布技能

完整的发布和版本管理流程。

**技能文件：** `release.md`

**功能：**
- 自动构建和打包扩展
- 生成更新日志（Changelog）
- 维护版本历史
- 创建 git tag 和 commit
- 更新 README 版本信息

**使用方法：**

1. 告诉 Claude "帮我发布新版本" 或 "执行 release 技能"

2. Claude 会自动执行以下步骤：
   - 检查当前状态
   - 确认版本号
   - 构建生产版本：`npm run build:prod`
   - 打包到 `versions/` 目录
   - 生成更新日志并更新 CHANGELOG.md
   - 创建 git commit 和 tag
   - 推送到远程仓库

3. 最后上传 zip 包到 Chrome Web Store

**手动使用命令：**

```bash
# 仅打包（使用已构建的 dist）
npm run package

# 构建生产版本 + 打包
npm run package:prod

# 构建开发版本 + 打包
npm run package:dev
```

**打包输出位置：**

```
versions/
└── SlideNote-v0.0.3.zip    # 发布到 Chrome Web Store 的文件
```

## 发布检查清单

使用 release 技能前，请确认：

- [ ] 所有更改已提交
- [ ] 版本号已更新（manifest.json, manifest.dev.json）
- [ ] README 已更新（版本号、功能列表）
- [ ] 翻译文件已更新（_locales/*/messages.json）
- [ ] CHANGELOG.md 已准备更新

## Chrome Web Store 发布步骤

1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

2. 选择 SlideNote 扩展

3. 上传 zip 包：
   ```
   versions/SlideNote-v{version}.zip
   ```

4. 填写更新说明（使用 CHANGELOG.md 中的内容）

5. 提交审核

## 版本号规则

遵循语义化版本 (Semantic Versioning)：

```
MAJOR.MINOR.PATCH

例：0.0.3
 ├─ MAJOR (0): 不兼容的 API 变更
 ├─ MINOR (0): 向后兼容的功能新增
 └─ PATCH (3): 向后兼容的问题修复
```

## 添加新技能

在本目录创建新的 `.md` 文件，描述技能的用途和使用方法。

示例：
```
skills/
├── README.md           # 本文件
├── release.md          # 发布技能
└── {skill-name}.md     # 你的新技能
```

## 相关文件

| 文件 | 说明 |
|------|------|
| `CHANGELOG.md` | 版本更新日志 |
| `manifest.json` | 生产版本配置 |
| `manifest.dev.json` | 开发版本配置 |
| `scripts/package.mjs` | 自动化打包脚本 |
| `scripts/prepare-dist.mjs` | 构建准备脚本 |
| `package.json` | npm 脚本配置 |
