# 数据导出功能需求文档

> **版本**: v0.0.2
> **创建日期**: 2025-01-11
> **状态**: 设计中

## 一、功能概述

### 1.1 背景

用户数据存储在 Chrome Storage 中，一旦浏览器卸载或数据丢失，用户无法备份或迁移自己的笔记数据。

### 1.2 目标

- 支持将所有笔记导出为 JSON 格式（完整备份）
- 支持将单条或全部笔记导出为 Markdown 格式（方便迁移）
- 支持导出归档笔记
- 用户可以随时备份自己的数据

## 二、功能需求

### 2.1 功能边界

**✅ 本版本包含：**

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 导出全部为 JSON | 完整数据备份，包含元数据 | P0 |
| 导出单条为 Markdown | 方便复制到其他笔记应用 | P0 |
| 导出全部为 Markdown | 合并为一个 MD 文件 | P0 |
| 导出归档笔记 | 可选择是否包含归档笔记 | P1 |
| 自动备份提醒 | 每月提醒用户备份 | P2 |

**❌ 本版本不包含：**

- 导入功能（未来版本考虑）
- 导出为 PDF/HTML
- 云端备份集成

### 2.2 用户交互流程

```
用户点击设置/导出按钮
    ↓
打开导出对话框
    ↓
选择导出格式和范围：
    - 格式：JSON / Markdown
    - 范围：全部 / 选中 / 归档
    ↓
点击"导出"
    ↓
浏览器下载文件
```

## 三、数据格式设计

### 3.1 JSON 格式

```json
{
  "version": "0.0.2",
  "exportedAt": "2025-01-11T10:30:00.000Z",
  "notes": [
    {
      "id": "note_1704965400000_abc123",
      "title": "常用账号",
      "content": "Gmail: xxx@gmail.com\n密码: ******",
      "createdAt": "2025-01-10T08:00:00.000Z",
      "updatedAt": "2025-01-11T10:30:00.000Z",
      "isArchived": false
    }
  ],
  "archivedNotes": [
    {
      "id": "note_1704879000000_def456",
      "title": "旧项目配置",
      "content": "...",
      "createdAt": "2024-12-15T09:00:00.000Z",
      "updatedAt": "2024-12-20T14:00:00.000Z",
      "archivedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "settings": {
    "activeNoteId": "note_1704965400000_abc123"
  }
}
```

### 3.2 Markdown 格式

#### 单条笔记

```markdown
# 常用账号

> 创建时间：2025-01-10 08:00
> 最后编辑：2025-01-11 10:30

Gmail: xxx@gmail.com
密码: ******
```

#### 全部笔记（合并）

```markdown
# SlideNote 笔记备份

> 导出时间：2025-01-11 10:30
> 笔记数量：3

---

## 常用账号

> 创建时间：2025-01-10 08:00
> 最后编辑：2025-01-11 10:30

Gmail: xxx@gmail.com
密码: ******

---

## API Keys

> 创建时间：2025-01-09 14:00
> 最后编辑：2025-01-09 14:00

OpenAI: sk-xxxx
```

### 3.3 文件命名规则

| 格式 | 文件名 | 示例 |
|------|--------|------|
| JSON 全部 | `SlideNote-备份-YYYY-MM-DD.json` | `SlideNote-备份-2025-01-11.json` |
| MD 单条 | `{笔记标题}.md` | `常用账号.md` |
| MD 全部 | `SlideNote-笔记-YYYY-MM-DD.md` | `SlideNote-笔记-2025-01-11.md` |

## 四、UI 设计

### 4.1 导出对话框

```
┌─────────────────────────────────────────────┐
│  导出笔记                          [×]      │
├─────────────────────────────────────────────┤
│                                              │
│  导出格式                                    │
│  ⦿ JSON（完整备份）                         │
│  ⦾ Markdown（方便查看和迁移）               │
│                                              │
│  导出范围                                    │
│  ⦿ 全部笔记                                 │
│  ⦾ 仅归档笔记                               │
│  ⦾ 当前笔记                                 │
│                                              │
│  ☑ 包含归档笔记（仅JSON）                    │
│                                              │
│  ┌───────────────────────────────────┐     │
│  │        [导出]        [取消]       │     │
│  └───────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

### 4.2 设置入口

在笔记列表底部添加设置按钮：

```
┌─────────────────────────────────────┐
│  [+ 新建笔记]    [⚙️ 设置]          │
└─────────────────────────────────────┘
```

## 五、技术方案

### 5.1 导出核心代码

```javascript
/**
 * 导出管理器
 */
class ExportManager {
  /**
   * 导出为 JSON
   */
  async exportAsJSON(options = {}) {
    const { includeArchived = true } = options;

    // 获取活跃笔记
    const result = await chrome.storage.sync.get({
      [STORAGE_KEYS.NOTES]: [],
      [STORAGE_KEYS.ACTIVE_NOTE_ID]: null,
    });

    const data = {
      version: chrome.runtime.getManifest().version,
      exportedAt: new Date().toISOString(),
      notes: result[STORAGE_KEYS.NOTES],
      settings: {
        activeNoteId: result[STORAGE_KEYS.ACTIVE_NOTE_ID],
      },
    };

    // 包含归档笔记
    if (includeArchived) {
      const archived = await chrome.storage.local.get({
        [STORAGE_KEYS.ARCHIVED_NOTES]: [],
      });
      data.archivedNotes = archived[STORAGE_KEYS.ARCHIVED_NOTES];
    }

    this._downloadJSON(data);
  }

  /**
   * 导出为 Markdown（单条）
   */
  async exportNoteAsMarkdown(noteId) {
    const note = await this.store.getNoteById(noteId);
    if (!note) return;

    const content = this._formatNoteAsMarkdown(note);
    const filename = `${note.title || '未命名笔记'}.md`;
    this._downloadText(content, filename);
  }

  /**
   * 导出为 Markdown（全部）
   */
  async exportAllAsMarkdown(options = {}) {
    const { includeArchived = false } = options;

    let notes = [...this.store.state.notes];

    if (includeArchived) {
      const archived = await this._getArchivedNotes();
      notes = [...notes, ...archived];
    }

    const content = this._formatNotesAsMarkdown(notes);
    const date = new Date().toISOString().split('T')[0];
    const filename = `SlideNote-笔记-${date}.md`;
    this._downloadText(content, filename);
  }

  /**
   * 格式化单条笔记为 Markdown
   */
  _formatNoteAsMarkdown(note) {
    const created = new Date(note.createdAt).toLocaleString('zh-CN');
    const updated = new Date(note.updatedAt).toLocaleString('zh-CN');

    return `# ${note.title || '未命名笔记'}

> 创建时间：${created}
> 最后编辑：${updated}

${note.content}
`;
  }

  /**
   * 格式化全部笔记为 Markdown
   */
  _formatNotesAsMarkdown(notes) {
    const date = new Date().toLocaleString('zh-CN');

    let content = `# SlideNote 笔记备份

> 导出时间：${date}
> 笔记数量：${notes.length}

---

`;

    notes.forEach((note, index) => {
      content += this._formatNoteAsMarkdown(note);
      if (index < notes.length - 1) {
        content += '---\n\n';
      }
    });

    return content;
  }

  /**
   * 下载 JSON 文件
   */
  _downloadJSON(data) {
    const date = new Date().toISOString().split('T')[0];
    const filename = `SlideNote-备份-${date}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    this._triggerDownload(blob, filename);
  }

  /**
   * 下载文本文件
   */
  _downloadText(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    this._triggerDownload(blob, filename);
  }

  /**
   * 触发浏览器下载
   */
  _triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
```

### 5.2 导出对话框组件

```javascript
/**
 * ExportDialog - 导出对话框
 */
class ExportDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 'json',        // json | markdown
      range: 'all',          // all | archived | current
      includeArchived: true,
    };
  }

  render() {
    // ... UI 实现
  }

  async _handleExport() {
    const exportManager = new ExportManager(this.props.store);

    switch (this.state.format) {
      case 'json':
        await exportManager.exportAsJSON({
          includeArchived: this.state.includeArchived,
        });
        break;
      case 'markdown':
        if (this.state.range === 'current') {
          await exportManager.exportNoteAsMarkdown(
            this.props.store.state.activeNoteId
          );
        } else {
          await exportManager.exportAllAsMarkdown({
            includeArchived: this.state.range === 'archived',
          });
        }
        break;
    }

    this.close();
  }
}
```

## 六、成功指标

| 指标 | 目标 |
|------|------|
| 导出成功率 | > 99% |
| 导出功能月使用率 | > 10% |
| 导出数据可读性 | 100% |

## 七、版本规划

- [ ] 导出为 JSON（完整备份）
- [ ] 导出为 Markdown（单条）
- [ ] 导出为 Markdown（全部）
- [ ] 导出对话框 UI
- [ ] 导出归档笔记
- [ ] 自动备份提醒

## 八、附录

### 8.1 文件大小估算

| 场景 | 估算大小 |
|------|----------|
| 10 条笔记（JSON） | ~5KB |
| 50 条笔记（JSON） | ~25KB |
| 10 条笔记（MD） | ~3KB |
| 50 条笔记（MD） | ~15KB |

### 8.2 变更记录

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2025-01-11 | v0.0.2 | 初始版本 |
