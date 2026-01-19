# SlideNote 工作流程

> **版本**: v1.0
> **更新日期**: 2025-01-18

本文档定义 SlideNote 项目的开发工作流程，确保需求、设计、开发、发布的规范化管理。

---

## 一、工作流程概览

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  需求讨论    │ -> │  版本规划    │ -> │  开发实现    │ -> │  版本发布    │
│  Planning   │    │  Versioning  │    │  Development │    │  Release     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                   │                   │                   │
      v                   v                   v                   v
 docs/planning/    docs/vX.X.X/       src/            releases/
                                         _locales/       CHANGELOG.md
```

---

## 二、详细工作流程

### 阶段 1：需求收集与讨论

**目标**: 收集需求，讨论可行性，不做版本承诺

**位置**: `docs/planning/`

```bash
docs/planning/
├── favorite-function/       # 收藏功能讨论
├── dark-mode/               # 暗黑模式讨论
└── sync-improvement/        # 同步优化讨论
```

**工作内容**:
- 记录用户反馈和产品想法
- 制作原型 HTML（如需）
- 可行性分析
- **不承诺版本号**

**进入下一阶段的条件**:
- 需求明确，优先级确定
- 基本设计方案达成一致

---

### 阶段 2：版本规划

**目标**: 确定版本内容，创建版本目录

**触发条件**:
- 积累一定数量的需求
- 或有重要功能需要优先发布

**操作**:
1. 确定版本号（如 v0.0.6）
2. 创建版本目录：
   ```bash
   docs/versions/v0.0.6/
   ├── README.md              # 版本概述
   ├── features/              # 新功能
   ├── bugs/                  # Bug 修复
   └── optimizations/         # 体验优化
   ```

3. 将 `docs/planning/` 中相关文档移动到对应分类目录

---

### 阶段 3：开发实现

**目标**: 完成功能开发和测试

**工作内容**:
1. **编码**: 在 `src/` 目录实现功能
2. **文档同步**: 更新对应的技术文档
3. **自测**: 本地测试功能

**文档规范**:
每个需求包含以下文档（按需）：
```
feature-name/
├── PRD.md           # 产品需求文档
├── UI-Spec.md       # UI 设计规范（如有交互变化）
├── Tech-Spec.md     # 技术实现方案
└── prototype.html   # 原型文件（如需）
```

---

### 阶段 4：版本发布

**目标**: 打包发布，更新版本信息

**发布前检查清单**:
- [ ] 所有 PRD 中的功能已实现
- [ ] 通过本地测试
- [ ] 更新 CHANGELOG.md
- [ ] 更新 package.json 版本号
- [ ] 构建生产版本

**发布步骤**:

1. **更新版本号**
   ```bash
   # package.json
   "version": "0.0.6"
   ```

2. **构建发布包**
   ```bash
   npm run build:prod
   npm run package:prod
   ```

3. **打包到 releases 目录**
   ```bash
   releases/
   └── SlideNote-v0.0.6.zip
   ```

4. **提交到 Chrome Web Store**

5. **更新 CHANGELOG.md**

---

## 三、目录结构规范

### 项目根目录

```
SlideNote/
├── src/                     # 源代码
├── _locales/               # 国际化资源
├── public/                 # 静态资源
├── dist/                   # 构建输出（.gitignore）
├── releases/               # 发布版本包
├── docs/                   # 文档中心
│   ├── planning/           # 需求讨论（临时）
│   ├── versions/           # 版本文档（按版本组织）
│   ├── design/             # 设计资源
│   ├── marketing/          # 营销素材
│   ├── _templates/         # 文档模板
│   ├── CHANGELOG.md        # 版本更新日志
│   └── README.md           # 文档索引
├── scripts/                # 构建脚本
├── package.json            # 项目配置
├── CHANGELOG.md            # 根目录更新日志（对外）
└── CLAUDE.md               # Claude Code 指引
```

### 版本目录结构

```
docs/versions/vX.X.X/
├── README.md                # 版本概述
├── features/                # 新功能
│   └── {feature-name}/
│       ├── PRD.md
│       ├── UI-Spec.md
│       ├── Tech-Spec.md
│       └── prototype.html
├── bugs/                    # Bug 修复
│   └── {bug-name}/
│       ├── PRD.md
│       └── Tech-Spec.md
└── optimizations/           # 体验优化
    └── {opt-name}/
        ├── PRD.md
        └── Tech-Spec.md
```

---

## 四、版本号规范

遵循 [语义化版本](https://semver.org/lang/zh-CN/)：

- **主版本号**: 重大架构变更（不适用当前阶段）
- **次版本号**: 新功能发布（0.1.0 → 0.2.0）
- **修订号**: Bug 修复、小优化（0.0.1 → 0.0.2）

当前阶段（开发初期）建议：
- 每个包含新功能的版本 → 次版本号 +1
- 纯 Bug 修复 → 修订号 +1

---

## 五、文档模板

### PRD 模板位置
`docs/_templates/PRD-Template.md`

### Tech-Spec 模板位置
`docs/_templates/Tech-Spec-Template.md`

---

## 六、快速参考

### 新建功能流程

```bash
# 1. 在 planning 目录讨论
docs/planning/new-feature/

# 2. 规划版本，创建目录
docs/versions/v0.0.7/
docs/versions/v0.0.7/features/new-feature/

# 3. 从模板创建文档
cp _templates/PRD-Template.md docs/versions/v0.0.7/features/new-feature/PRD.md

# 4. 开发实现
# ... 在 src/ 中编码 ...

# 5. 发布
npm run build:prod && npm run package:prod
```

### 版本发布检查清单

| 项目 | 状态 |
|------|------|
| 版本号更新 | ☐ |
| CHANGELOG 更新 | ☐ |
| 功能测试通过 | ☐ |
| 构建成功 | ☐ |
| 发布包生成 | ☐ |
| 版本文档归档 | ☐ |

---

## 七、工作文件

| 文件 | 用途 | 维护者 |
|------|------|--------|
| CLAUDE.md | Claude Code 项目指引 | 开发者 |
| CHANGELOG.md | 对外版本日志 | 发布时 |
| docs/README.md | 文档索引 | 每次 |
| docs/versions/vX.X.X/README.md | 版本概述 | 版本启动时 |
