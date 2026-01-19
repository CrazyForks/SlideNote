# 夜间模式适配 PRD

> **版本**: v0.0.6
> **类型**: 新增功能
> **优先级**: P1
> **状态**: 设计中
> **日期**: 2025-01-19

---

## 一、需求背景

### 1.1 用户痛点

- **夜间使用刺眼**：在低光环境下使用 SlideNote，白色背景过于刺眼，造成视觉疲劳
- **系统不一致**：用户操作系统已启用深色模式，但 SlideNote 仍显示亮色界面
- **长时间使用**：作为常驻侧边栏工具，长时间亮色界面增加眼部负担

### 1.2 产品价值

| 价值点 | 描述 |
|--------|------|
| 用户舒适度 | 减少夜间使用时的视觉疲劳 |
| 系统一致性 | 与操作系统深色模式保持一致 |
| 产品竞争力 | 主流笔记应用（Notion、Obsidian、Flomo）均已支持 |
| 使用时长 | 降低视觉疲劳，延长单次使用时长 |

### 1.3 目标用户

- **核心用户**：夜间工作的开发者、学生、创作者
- **场景用户**：长时间使用 SlideNote 的重度用户

---

## 二、需求概述

### 2.1 功能定义

为 SlideNote 添加夜间模式（深色主题），支持：

1. **自动切换**：根据操作系统深色模式设置自动切换
2. **手动切换**：用户可在设置中手动切换亮/暗模式
3. **状态记忆**：记住用户的选择，跨会话保持

### 2.2 非目标

- 不支持自定义主题色（保持产品简单）
- 不支持多种预设主题（仅亮/暗两套）
- 不跟随时间自动切换（仅跟随系统设置）

---

## 三、设计方案

### 3.1 色彩系统

#### 亮色模式（现有，保持不变）

```css
--color-bg-primary: #ffffff;
--color-bg-secondary: #f5f5f5;
--color-text-primary: #1a1a1a;
--color-text-secondary: #666666;
```

#### 暗色模式（新增）

```css
--color-bg-primary: #1a1a1a;      /* 深黑背景 */
--color-bg-secondary: #242424;    /* 次级背景 */
--color-bg-hover: #2d2d2d;        /* 悬停背景 */
--color-bg-active: #2a2a2a;       /* 激活背景 */
--color-text-primary: #e8e8e8;    /* 主文本 */
--color-text-secondary: #a0a0a0;  /* 次级文本 */
--color-text-tertiary: #6b6b6b;    /* 三级文本 */
--color-text-placeholder: #555555; /* 占位符 */
--color-border: #333333;          /* 边框 */
--color-overlay: rgba(0, 0, 0, 0.6); /* 遮罩 */
```

### 3.2 切换方式

#### 方式一：自动跟随系统（默认）

```javascript
// 监听系统深色模式变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (userMode === 'auto') {
    setDarkMode(e.matches);
  }
});
```

#### 方式二：手动切换

在 Toolbar 添加主题切换按钮：

```
┌─────────────────────────────┐
│ [🔍] [新建]         [🌙] [◀] │  ← 月亮图标切换到暗色
└─────────────────────────────┘

暗色模式时：
┌─────────────────────────────┐
│ [🔍] [新建]         [☀️] [◀] │  ← 太阳图标切换到亮色
└─────────────────────────────┘
```

### 3.3 主题模式状态

| 模式 | 说明 | 存储值 |
|------|------|--------|
| `auto` | 跟随系统（默认） | `'auto'` |
| `light` | 强制亮色 | `'light'` |
| `dark` | 强制暗色 | `'dark'` |

---

## 四、交互设计

### 4.1 切换交互

| 操作 | 效果 |
|------|------|
| 点击主题按钮 | 亮 → 暗 → 自动 → 亮（循环） |
| 系统深色模式变化 | 自动模式下实时切换 |
| 刷新页面 | 保持上次选择的主题 |

### 4.2 过渡动画

```css
/* 全局过渡，避免突兀切换 */
* {
  transition: background-color 0.2s ease,
              color 0.2s ease,
              border-color 0.2s ease;
}
```

### 4.3 图标设计

| 图标 | 使用场景 |
|------|----------|
| 🌙 (月亮) | 当前为亮色/自动(亮)，点击切换到暗色 |
| ☀️ (太阳) | 当前为暗色/自动(暗)，点击切换到亮色 |
| 🔄 (自动) | 当前为自动模式，显示跟随系统 |

**简化方案**：
- 自动(亮) / 亮色 → 显示 🌙
- 自动(暗) / 暗色 → 显示 ☀️

---

## 五、技术实现要点

### 5.1 CSS 架构

```css
/* 亮色模式（默认） */
:root, [data-theme="light"] {
  --color-bg-primary: #ffffff;
  /* ... */
}

/* 暗色模式 */
[data-theme="dark"] {
  --color-bg-primary: #1a1a1a;
  /* ... */
}

/* 跟随系统 */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #1a1a1a;
    /* ... */
  }
}
```

### 5.2 存储设计

```javascript
// Chrome Storage Local
const THEME_KEY = 'slidenote_theme';

// 存储值
{
  theme: 'auto' | 'light' | 'dark'
}
```

### 5.3 组件改造

| 文件 | 改动内容 |
|------|----------|
| `Store.js` | 新增 `theme` 状态，`setTheme()` 方法 |
| `Toolbar.js` | 新增主题切换按钮 |
| `app.js` | 初始化时应用主题，监听系统变化 |
| `styles.css` | 新增暗色模式 CSS 变量 |

### 5.4 图标 SVG

```html
<!-- 月亮图标 -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
</svg>

<!-- 太阳图标 -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <circle cx="12" cy="12" r="5"/>
  <line x1="12" y1="1" x2="12" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="1" y1="12" x2="3" y2="12"/>
  <line x1="21" y1="12" x2="23" y2="12"/>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
</svg>
```

---

## 六、边界情况处理

| 场景 | 处理方式 |
|------|----------|
| 用户选择"自动"，但系统不支持查询 | 默认为亮色模式 |
| 存储中没有主题设置 | 默认为 `'auto'` |
| 切换主题时正在编辑笔记 | 保持编辑器焦点，不中断输入 |
| Markdown 代码块在暗色模式下 | 使用深色背景，保持代码可读性 |

---

## 七、验收标准

### 7.1 功能验收

- [ ] 点击主题切换按钮可在亮/暗/自动间循环
- [ ] 系统深色模式变化时，自动模式下的界面实时切换
- [ ] 刷新页面后，主题设置保持不变
- [ ] 所有界面元素（列表、编辑器、弹窗、菜单）均正确适配暗色

### 7.2 视觉验收

- [ ] 暗色模式下文字对比度足够（WCAG AA 标准）
- [ ] 主题切换过渡流畅，无闪烁
- [ ] Markdown 代码块在暗色模式下清晰可读
- [ ] 选中状态、边框、阴影在两种模式下均有良好区分度

### 7.3 兼容性验收

- [ ] Chrome 114+ 均正常工作
- [ ] 不支持 `prefers-color-scheme` 的旧版 Chrome 降级为亮色模式

---

## 八、工时预估

| 任务 | 预估工时 |
|------|----------|
| CSS 暗色变量定义 | 30min |
| Store 主题状态管理 | 30min |
| Toolbar 切换按钮 | 1h |
| 系统主题监听 | 30min |
| 各组件视觉调优 | 1.5h |
| 国际化文案 | 15min |
| 测试与调试 | 1h |

**总计**：约 5 小时

---

## 九、后续优化（暂不实现）

- [ ] 主题色自定义（如蓝色、绿色、紫色等）
- [ ] 多套预设主题（如护眼模式、高对比度模式）
- [ ] 按时间段自动切换（如日落后自动切换）
- [ ] 每条笔记独立主题记忆

---

## 十、参考资料

- [Material Design 3 Dark Theme](https://m3.material.io/styles/color/the-color-system/tokens)
- [Apple Human Interface Guidelines - Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)
- [WCAG Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
