# Release - 发布技能

SlideNote 项目的发布和版本管理技能。

## 功能

- 自动构建和打包扩展
- 生成更新日志（Changelog）
- 维护版本历史
- 创建 git tag 和 commit
- 更新 README 版本信息

## 使用方法

```
/release
```

执行完整的发布流程：
1. 检查当前状态（是否有未提交的更改）
2. 确认版本号
3. 构建生产版本
4. 打包到 `versions/` 目录
5. 生成更新日志
6. 创建 git commit 和 tag
7. 推送到远程仓库

## 发布流程

### 1. 版本检查

读取 `manifest.json` 获取当前版本号，检查是否与上一个发布版本不同。

### 2. 构建打包

```bash
npm run build:prod
npm run package
```

输出文件：`versions/SlideNote-v{version}.zip`

### 3. 生成更新日志

基于以下信息生成更新日志：
- 上次发布以来的 git commits
- 当前版本号
- 变更的文件列表

### 4. Git 操作

- 创建 commit：`chore: release v{version}`
- 创建 tag：`v{version}`
- 推送到 origin

## 更新日志格式

```markdown
## v{version} ({date})

### 新增
- 功能1
- 功能2

### 修复
- 修复1

### 技术变更
- 变更1
- 变更2

### 文件变更
- 修改: file1.js, file2.css
- 新增: file3.js
```

## 版本号规则

遵循语义化版本 (Semantic Versioning)：
- `MAJOR.MINOR.PATCH`
- MAJOR: 不兼容的 API 变更
- MINOR: 向后兼容的功能新增
- PATCH: 向后兼容的问题修复

## CHANGELOG 维护

更新日志保存在 `CHANGELOG.md`，格式：

```markdown
# 更新日志

## v0.0.3 (2024-01-14)
### 新增
- Markdown 编辑器
- 导航箭头

## v0.0.2 (2024-01-10)
### 修复
- 修复保存问题
```

## 发布检查清单

- [ ] 所有更改已提交
- [ ] 版本号已更新（manifest.json, manifest.dev.json）
- [ ] README 已更新
- [ ] 翻译文件已更新
- [ ] 生产版本构建成功
- [ ] zip 包已创建
- [ ] 更新日志已生成
- [ ] git tag 已创建
- [ ] 代码已推送

## Chrome Web Store 发布

1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 上传 `versions/SlideNote-v{version}.zip`
3. 填写更新说明（使用生成的更新日志）
4. 提交审核

## 相关文件

- `manifest.json` - 生产版本配置
- `manifest.dev.json` - 开发版本配置
- `scripts/package.mjs` - 打包脚本
- `scripts/prepare-dist.mjs` - 构建准备脚本
- `CHANGELOG.md` - 更新日志
