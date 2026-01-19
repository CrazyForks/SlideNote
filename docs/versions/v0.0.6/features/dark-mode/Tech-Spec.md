# 夜间模式技术方案（简化版）

> **版本**: v0.0.6
> **关联 PRD**: `PRD.md`
> **日期**: 2025-01-19
> **方案**: 纯 CSS，自动跟随系统

---

## 一、方案概述

### 1.1 核心设计

| 项目 | 方案 |
|------|------|
| **实现方式** | 纯 CSS，使用 `@media (prefers-color-scheme: dark)` |
| **切换机制** | 自动跟随浏览器/操作系统深色模式设置 |
| **用户操作** | 无需手动切换，零配置 |
| **状态持久化** | 由操作系统管理 |
| **兼容性** | Chrome 76+（2019年及以后版本均支持） |

### 1.2 方案优势

```
原方案（手动切换）                简化方案（自动跟随）
┌──────────────┐                ┌──────────────┐
│  ThemeManager│   ❌ 不需要    │              │
│  切换按钮     │   ❌ 不需要    │    仅 CSS    │
│  状态存储     │   ❌ 不需要    │              │
│  事件监听     │   ❌ 不需要    │              │
└──────────────┘                └──────────────┘
    工时: 5h                        工时: 1h
```

---

## 二、CSS 实现

### 2.1 完整代码

**文件**: `src/sidepanel/styles.css`

```css
/* ============================================
   亮色模式（默认）
   ============================================ */
:root {
  /* 背景 */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-bg-hover: #e8e8e8;
  --color-bg-active: #f0f7ff;

  /* 文本 */
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-tertiary: #999999;
  --color-text-placeholder: #bbbbbb;

  /* 边框 */
  --color-border: #e5e5e5;
  --color-border-focus: #0066cc;

  /* 主色调 */
  --color-primary: #0066cc;
  --color-primary-light: #f0f7ff;
  --color-primary-dark: #0052a3;

  /* 功能色 */
  --color-error: #ff4444;
  --color-success: #22c55e;

  /* 遮罩 */
  --color-overlay: rgba(0, 0, 0, 0.4);

  /* 滚动条 */
  --scrollbar-thumb: #d0d0d0;
  --scrollbar-thumb-hover: #b0b0b0;

  /* 折叠状态边框 */
  --collapsed-border: rgba(0, 0, 0, 0.06);
}

/* ============================================
   暗色模式（自动跟随系统）
   ============================================ */
@media (prefers-color-scheme: dark) {
  :root {
    /* 背景 - 深灰而非纯黑，减少视觉疲劳 */
    --color-bg-primary: #1a1a1a;
    --color-bg-secondary: #242424;
    --color-bg-hover: #2d2d2d;
    --color-bg-active: #2a2a2a;

    /* 文本 - 降低纯白亮度 */
    --color-text-primary: #e8e8e8;
    --color-text-secondary: #a0a0a0;
    --color-text-tertiary: #6b6b6b;
    --color-text-placeholder: #555555;

    /* 边框 */
    --color-border: #333333;
    --color-border-focus: #4a9eff;

    /* 主色调 - 暗色下使用更亮的蓝色 */
    --color-primary: #4a9eff;
    --color-primary-light: rgba(74, 158, 255, 0.15);
    --color-primary-dark: #3a8eef;

    /* 功能色 */
    --color-error: #ff6b6b;
    --color-success: #4ade80;

    /* 遮罩 */
    --color-overlay: rgba(0, 0, 0, 0.6);

    /* 滚动条 */
    --scrollbar-thumb: #4a4a4a;
    --scrollbar-thumb-hover: #5a5a5a;

    /* 折叠状态边框 */
    --collapsed-border: rgba(255, 255, 255, 0.06);
  }
}
```

### 2.2 滚动条适配

```css
/* 使用 CSS 变量的滚动条 */
::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}
```

---

## 三、文件改动清单

| 文件 | 改动内容 | 改动量 |
|------|----------|--------|
| `src/sidepanel/styles.css` | 新增暗色模式 CSS 变量 | +40 行 |

**无需修改任何 JS 文件**

---

## 四、兼容性

### 4.1 浏览器支持

`@media (prefers-color-scheme: dark)` 支持情况：

| 浏览器 | 最低版本 | 发布时间 |
|--------|----------|----------|
| Chrome | 76+ | 2019-07 |
| Edge | 79+ | 2020-01 |
| Firefox | 67+ | 2019-05 |
| Safari | 12.1+ | 2019-03 |

### 4.2 降级处理

不支持该特性的旧版浏览器会自动使用亮色模式（`:root` 默认值），无需额外代码。

---

## 五、测试要点

### 5.1 测试方法

1. **系统设置切换**：
   - macOS: 系统设置 → 外观 → 深色/浅色
   - Windows: 设置 → 个性化 → 颜色 → 深色/浅色
   - Linux: 取决于桌面环境

2. **Chrome 临时测试**：
   - 打开 DevTools → 设置 → Preferences → Appearance
   - 勾选/取消 "Emulate prefers-color-scheme dark mode"

### 5.2 视觉验收

| 检查项 | 亮色模式 | 暗色模式 |
|--------|----------|----------|
| 背景色 | 纯白 #ffffff | 深灰 #1a1a1a |
| 文字对比度 | 符合 WCAG AA | 符合 WCAG AA |
| 边框可见性 | 清晰 | 清晰 |
| 代码块 | 背景与文本对比充分 | 背景与文本对比充分 |
| 选中状态 | 蓝色高亮明显 | 蓝色高亮明显 |

---

## 六、工时预估

| 任务 | 工时 |
|------|------|
| CSS 变量定义 | 30min |
| 样式调优（边框、阴影等） | 30min |
| 测试 | 30min |
| **总计** | **1.5h** |

---

## 七、后续扩展（可选）

如果未来需要手动切换功能，可在现有 CSS 基础上轻松扩展：

```css
/* 预留扩展接口 */
:root,
[data-theme="light"] {
  /* 亮色变量 */
}

[data-theme="dark"] {
  /* 暗色变量（复用 @media 中的值） */
}

/* 原有的自动跟随逻辑保持不变 */
@media (prefers-color-scheme: dark) {
  :root {
    /* 暗色变量 */
  }
}
```

这样只需在 JS 中添加 `setAttribute('data-theme', 'dark')` 即可实现手动切换，无需重写 CSS。
