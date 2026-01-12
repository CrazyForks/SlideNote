# SlideNote 图标资源

## 文件列表

### 插件图标（Chrome 扩展用）

| 文件 | 尺寸 | 用途 |
|------|------|------|
| `icon-16.svg` | 16x16 | 工具栏小图标 |
| `icon-32.svg` | 32x32 | Windows/macOS 扩展管理器 |
| `icon-48.svg` | 48x48 | 扩展管理页面 |
| `icon-128.svg` | 128x128 | Chrome Web Store、安装对话框 |

**设计说明**：蓝色背景 (#0066CC) + 白色文档线条，简洁易识别

### UI 图标（界面内使用）

| 文件 | 用途 |
|------|------|
| `ui-search.svg` | 搜索框图标 |
| `ui-close.svg` | 关闭按钮 (×) |
| `ui-delete.svg` | 删除按钮（垃圾桶） |
| `ui-plus.svg` | 新建按钮 (+) |
| `ui-note.svg` | 笔记列表空状态 |
| `ui-file.svg` | 编辑器空状态 |
| `ui-trash.svg` | 删除确认弹窗 |

**设计说明**：线性图标，2px 描边，圆角端点

---

## 使用方式

### 插件图标（manifest.json）

```json
{
  "icons": {
    "16": "icons/icon-16.svg",
    "32": "icons/icon-32.svg",
    "48": "icons/icon-48.svg",
    "128": "icons/icon-128.svg"
  },
  "action": {
    "default_icon": {
      "16": "icons/icon-16.svg",
      "32": "icons/icon-32.svg",
      "48": "icons/icon-48.svg"
    }
  }
}
```

### UI 图标（内联到代码）

```javascript
// 方式一：直接内联 SVG
const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="11" cy="11" r="8"/>
  <path d="M21 21l-4.35-4.35"/>
</svg>`;

// 方式二：从文件读取
import searchIcon from './icons/ui-search.svg?raw';
```

---

## SVG 转 PNG（可选）

Chrome Web Store 支持 SVG 图标，但如果需要 PNG 格式：

### 方法一：在线转换
- [SVG to PNG](https://svgtopng.com/)
- [CloudConvert](https://cloudconvert.com/svg-to-png)

### 方法二：命令行（macOS）

```bash
# 安装 librsvg
brew install librsvg

# 转换
svg2png -w 128 -h 128 icon-128.svg > icon-128.png
svg2png -w 48 -h 48 icon-48.svg > icon-48.png
svg2png -w 32 -h 32 icon-32.svg > icon-32.png
svg2png -w 16 -h 16 icon-16.svg > icon-16.png
```

### 方法三：使用 Figma/Sketch
1. 导入 SVG 文件
2. 导出为 PNG @2x

---

## 图标预览

### 插件图标
```
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐
│  ┌───┐  │  │  ┌────┐ │  │  ┌─────┐│  │  ┌─────────┐  │
│  │═══│  │  │  │════││  │  │═════││  │  │═════════│  │
│  │═══│  │  │  │════││  │  │═════││  │  │═════════│  │
│  └───┘  │  │  └────┘ │  │  └─────┘│  │  └─────────┘  │
└─────────┘  └─────────┘  └─────────┘  └─────────────────┘
   16x16        32x32        48x48          128x128
```

### UI 图标
```
🔍 搜索       × 关闭       🗑️ 删除
┌───┐         ┌─┐         ┌─────┐
│ ⊖ │         │×│         │ ╱╲  │
│ ⟋ │         │ │         │███  │
└───┘         └─┘         │███  │
                          └─────┘

➕ 新建       📝 笔记       📄 文件
┌─┐          ┌───┐        ┌───┐
│││          │ ╱ │        │ ╱ │
│+│          │ ╲ │        │ ╲ │
│││          └───┘        └───┘
└─┘
```

---

## 设计规范

### 插件图标
- **主色**: #0066CC（蓝色）
- **辅助色**: #FFFFFF（白色）
- **圆角**: 3px (16x16), 6px (32x32), 10px (48x48), 24px (128x128)
- **线条粗细**: 根据尺寸自适应

### UI 图标
- **线条粗细**: 2px
- **端点**: 圆角 (stroke-linecap="round")
- **连接**: 圆角 (stroke-linejoin="round")
- **颜色**: 继承文本颜色 (currentColor)

---

## 更新日志

| 日期 | 变更内容 |
|------|----------|
| 2025-01-11 | 初始创建所有图标 |
