# SlideNote 国际化 (i18n) 实现方案

## 一、需求分析

### 1.1 需要国际化的内容

| 位置 | 中文内容 | 用途 |
|------|---------|------|
| manifest.json | 名称、描述 | Chrome 应用商店 |
| Toolbar | 搜索笔记...、新建笔记、新建 | 顶部工具栏 |
| NoteList | 还没有笔记 | 空状态 |
| NoteEditor | 未命名笔记、开始输入...、已保存 | 编辑器 |
| ConfirmDialog | 确认删除、取消、确认 | 删除确认 |
| ContextMenu | 移动到顶部、上移、下移、移动到底部、删除 | 右键菜单 |
| Footer | 由咕咚同学开发、Slide notes... | 页脚信息 |

### 1.2 支持的语言

| 语言 | Locale Code | 优先级 |
|------|-------------|--------|
| 简体中文 | `zh_CN` | P0 |
| 英语 | `en` | P0 |
| 繁体中文 | `zh_TW` | P1 |
| 日语 | `ja` | P2 |

---

## 二、技术方案

### 2.1 使用 Chrome i18n API

Chrome 扩展提供了内置的国际化 API：

```javascript
// 获取翻译文本
chrome.i18n.getMessage('messageName');

// 获取当前语言
chrome.i18n.getUILanguage(); // 如 'zh-CN', 'en-US'
```

### 2.2 目录结构

```
SlideNote/
├── _locales/
│   ├── zh_CN/
│   │   └── messages.json       # 简体中文
│   ├── en/
│   │   └── messages.json       # 英语
│   └── zh_TW/
│       └── messages.json       # 繁体中文（预留）
├── manifest.json
└── src/sidepanel/
```

### 2.3 messages.json 格式

```json
{
  "appName": {
    "message": "SlideNote 侧边笔记",
    "description": "应用名称"
  },
  "appDesc": {
    "message": "侧边栏笔记插件，跨设备自动同步",
    "description": "应用描述"
  },
  "newNote": {
    "message": "新建笔记"
  },
  "searchPlaceholder": {
    "message": "搜索笔记..."
  }
}
```

---

## 三、实现步骤

### Phase 1: 基础设施 (P0)

#### 1.1 创建 messages.json 文件

**创建 `_locales/zh_CN/messages.json`**
- 包含所有 UI 文本的中文翻译
- 使用有意义的 key 命名（如 `newNote` 而非 `msg001`）

**创建 `_locales/en/messages.json`**
- 包含所有 UI 文本的英文翻译
- 保持 key 与中文版一致

#### 1.2 更新 manifest.json

```json
{
  "name": "__MSG_appName__",
  "description": "__MSG_appDesc__",
  "default_locale": "zh_CN"
}
```

### Phase 2: 组件改造 (P0)

#### 2.1 创建 i18n 工具函数

**创建 `src/sidepanel/utils/i18n.js`**

```javascript
/**
 * 国际化工具函数
 * 封装 chrome.i18n API
 */

export function t(key, placeholders = {}) {
  return chrome.i18n.getMessage(key, placeholders);
}

// 使用示例:
// t('newNote') → '新建笔记'
// t('deleteConfirm', {title: '笔记1'}) → '确定删除「笔记1」吗？'
```

#### 2.2 更新各组件

| 组件 | 需要修改的文本 |
|------|---------------|
| Toolbar.js | 搜索占位符、新建按钮、关闭按钮 |
| NoteList.js | 空状态、未命名笔记 |
| NoteEditor.js | 占位符、已保存、空状态 |
| ConfirmDialog.js | 标题、按钮 |
| ContextMenu.js | 菜单项 |
| app.js | 页脚信息 |

### Phase 3: 语言切换 (P1)

#### 3.1 自动语言检测

Chrome 扩展自动根据浏览器语言选择对应的 `messages.json`

#### 3.2 手动切换（可选）

在设置中添加语言切换选项，存储在 `chrome.storage.local` 中

---

## 四、消息 Key 命名规范

### 4.1 命名规则

```
{模块}_{具体含义}

示例:
- toolbar_newNote       # 工具栏-新建笔记
- toolbar_search        # 工具栏-搜索
- editor_placeholder    # 编辑器-占位符
- dialog_cancel         # 对话框-取消
- menu_moveTop          # 菜单-移动到顶部
```

### 4.2 占位符使用

对于包含动态内容的消息，使用 `$1$`, `$2$` 占位符：

```json
{
  "deleteConfirm": {
    "message": "确定删除「$1$」吗？此操作无法撤销。"
  }
}
```

使用：
```javascript
chrome.i18n.getMessage('deleteConfirm', [note.title])
```

---

## 五、实施计划

### 5.1 当前工作量估算

| 任务 | 工作量 |
|------|--------|
| 创建 messages.json (中英) | 30 分钟 |
| 更新 manifest.json | 5 分钟 |
| 创建 i18n.js 工具 | 10 分钟 |
| 更新 6 个组件 | 45 分钟 |
| 测试验证 | 15 分钟 |
| **总计** | **约 2 小时** |

### 5.2 执行顺序

1. ✅ 创建 `_locales/zh_CN/messages.json`
2. ✅ 创建 `_locales/en/messages.json`
3. ✅ 更新 `manifest.json`
4. ✅ 创建 `src/sidepanel/utils/i18n.js`
5. ✅ 更新各组件
6. ✅ 构建测试
7. ✅ 提交代码

---

## 六、注意事项

### 6.1 Chrome 扩展 i18n 限制

- 必须使用 `_locales` 目录（固定命名）
- messages.json 必须是有效的 JSON
- key 只能包含字母、数字、下划线

### 6.2 测试要点

- 切换浏览器语言，验证 UI 文本变化
- 检查占位符替换是否正确
- 验证空状态、错误提示等边界情况

### 6.3 后续扩展

- 添加更多语言只需添加新的 `_locales/{lang}/messages.json`
- 不需要修改代码
