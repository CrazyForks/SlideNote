# SlideNote 项目文档

> **Slide notes, always by your side**
> **侧边笔记，常伴左右**

## 文档结构

```
docs/
├── README.md                 # 本文件
├── CHANGELOG.md             # 版本更新日志
├── planning/                # 需求讨论（临时，未纳入版本）
├── _templates/              # 文档模板
│   ├── PRD-Template.md      # PRD 模板
│   └── Tech-Spec-Template.md # 技术方案模板
├── design/                  # 设计资源（landing page, 图标等）
├── marketing/               # 营销素材
└── versions/                # 版本文档
    ├── v0.0.1/              # MVP 版本
    ├── v0.0.2/              # 归档和导出版本
    ├── v0.0.3/              # Markdown 编辑器版本
    └── v0.0.6/              # 开发中（收藏功能 + 侧边栏优化）
```

## 版本管理规范

每个版本文件夹包含：

```
vX.X.X/
├── README.md                # 版本概述
├── features/                # 新功能
│   └── {feature-name}/
│       ├── PRD.md           # 产品需求文档
│       ├── UI-Spec.md       # UI 设计规范
│       ├── Tech-Spec.md     # 技术实现方案
│       └── prototype.html   # 交互原型（可选）
├── bugs/                    # Bug 修复
│   └── {bug-name}/
│       ├── PRD.md
│       └── Tech-Spec.md
└── optimizations/           # 体验优化
    └── {opt-name}/
        ├── PRD.md
        └── Tech-Spec.md
```

## 版本历史

| 版本 | 日期 | 状态 | 说明 |
|------|------|------|------|
| v0.0.6 | 2025-01-18 | 开发中 | 收藏功能 + 侧边栏窄化优化 |
| v0.0.5 | 2025-01-15 | 已发布 | Bug 修复 + 小优化 |
| v0.0.4 | 2025-01-12 | 已发布 | 小版本更新 |
| v0.0.3 | 2025-01-11 | 已发布 | Markdown 编辑器 |
| v0.0.2 | 2025-01-12 | 已发布 | 存储归档 + 数据导出 |
| v0.0.1 | 2025-01-11 | 已发布 | MVP 版本：基础笔记功能 |

## 快速导航

### 当前开发版本

- [v0.0.6 收藏功能 + 侧边栏优化](./versions/v0.0.6/) - 开发中

### 历史版本

- [v0.0.5](./versions/v0.0.5/) - Bug 修复
- [v0.0.4](./versions/v0.0.4/) - 小版本更新
- [v0.0.3](./versions/v0.0.3/) - Markdown 编辑器
- [v0.0.2](./versions/v0.0.2/) - 存储归档 + 数据导出
- [v0.0.1](./versions/v0.0.1/) - MVP 基础笔记功能

### 文档模板

- [PRD 模板](./_templates/PRD-Template.md)
- [Tech-Spec 模板](./_templates/Tech-Spec-Template.md)

### 工作流程

详细工作流程请参考：[项目根目录 / WORKFLOW.md](../../WORKFLOW.md)
