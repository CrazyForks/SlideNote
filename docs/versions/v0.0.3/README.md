# SlideNote v0.0.3 版本文档

> **侧边笔记，常伴左右**
> **状态**: 规划中

---

## 版本概述

v0.0.3 版本核心是 Markdown 编辑支持，让笔记支持富文本格式，并解决 Chrome Storage 容量限制问题。

### 主要目标

- 支持 Markdown 语法高亮和预览
- 提供数据导出能力（JSON/MD 格式）
- 实现存储归档，突破 100KB 限制

---

## 目录结构

```
v0.0.3/
├── README.md              # 本文件
├── bugs/                  # Bug 修复
├── features/              # 新功能
│   ├── markdown-editor/   # Markdown 编辑器
│   ├── export-data/       # 数据导出
│   └── archive-storage/   # 存储归档
└── optimizations/         # 体验优化
```

---

## 功能清单

| 类型 | 名称 | 优先级 | 状态 | 文档 |
|------|------|--------|------|------|
| 新功能 | Markdown 编辑器 | P0 | 规划中 | [PRD](./features/markdown-editor/PRD.md) \| [Tech](./features/markdown-editor/Tech-Spec.md) \| [UI](./features/markdown-editor/UI-Spec.md) |
| 新功能 | 数据导出 | P0 | 规划中 | [PRD](./features/export-data/PRD.md) \| [Tech](./features/export-data/Tech-Spec.md) \| [UI](./features/export-data/UI-Spec.md) |
| 新功能 | 存储归档 | P1 | 规划中 | [PRD](./features/archive-storage/PRD.md) |
| 优化 | (待添加) | - | - | - |
| Bug | (待添加) | - | - | - |

---

## 功能详情

### Markdown 编辑器

支持 Markdown 语法的笔记编辑和预览。

- **语法支持**: 标题、列表、代码块、链接、图片等
- **预览模式**: 实时预览/分屏预览
- **工具栏**: 快捷插入常用格式
- **文档**: [PRD](./features/markdown-editor/PRD.md) | [Tech-Spec](./features/markdown-editor/Tech-Spec.md) | [UI-Spec](./features/markdown-editor/UI-Spec.md)

### 数据导出

支持将笔记导出为 JSON 或 Markdown 格式。

- **格式**: JSON（完整备份）、Markdown（方便查看）
- **范围**: 全部笔记、当前笔记、归档笔记
- **文档**: [PRD](./features/export-data/PRD.md) | [Tech-Spec](./features/export-data/Tech-Spec.md) | [UI-Spec](./features/export-data/UI-Spec.md)

### 存储归档

将不常用的旧笔记归档到 `storage.local`，释放 sync 存储空间。

- **问题**: Chrome Storage Sync 只有 100KB 容量
- **方案**: 手动/自动归档旧笔记到 local 存储
- **文档**: [PRD](./features/archive-storage/PRD.md)

---

## 变更记录

| 日期 | 变更内容 |
|------|----------|
| 2025-01-13 | 初始版本，从 v0.0.2 移入未实现需求 |
