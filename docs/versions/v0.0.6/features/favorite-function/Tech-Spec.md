# 收藏功能技术方案文档

> **版本**: v0.0.6
> **创建日期**: 2025-01-18
> **状态**: 待开发

---

## 一、技术选型

### 1.1 技术方案

| 方案 | 说明 | 理由 |
|------|------|------|
| 数据存储 | Chrome Storage Sync API | 跨设备自动同步，无需额外开发 |
| 收藏状态 | 笔记对象新增 `starred` 字段 | 简单直接，与现有数据结构一致 |
| 收藏入口 | 右键菜单 + 更多菜单 | 不占用列表空间，保持界面简洁 |
| 筛选模式 | Store 新增 `filterMode` 状态 | 复用现有搜索筛选逻辑 |

---

## 二、数据设计

### 2.1 数据结构

```javascript
// 笔记对象（新增 starred 字段）
{
  id: "note_1234567890_abc123",
  title: "笔记标题",
  content: "笔记内容",
  starred: false,        // ← 新增：是否已收藏
  createdAt: 1705488000000,
  updatedAt: 1705488000000,
  order: 1
}
```

### 2.2 存储设计

| 存储位置 | Key | 类型 | 说明 |
|----------|-----|------|------|
| storage.sync | `slidenote_notes` | Array | 笔记数组（包含 starred 字段） |
| storage.sync | `slidenote_filter_mode` | String | 筛选模式：'all' 或 'starred' |

**存储容量考虑**：
- Chrome Storage Sync 单项限制：~8KB
- 总容量限制：~100KB
- 每个笔记增加一个 `starred` 布尔字段，影响 < 1%

### 2.3 数据兼容性

```javascript
// 兼容处理：旧笔记没有 starred 字段，默认为 false
function normalizeNote(note) {
  return {
    ...note,
    starred: note.starred ?? false,
  };
}
```

---

## 三、核心模块设计

### 3.1 Store.js 扩展

```javascript
/**
 * Store 新增状态
 */
state = {
  notes: [],
  activeNoteId: null,
  searchQuery: '',
  sidebarCollapsed: false,
  filterMode: 'all',  // ← 新增：'all' | 'starred'
}

/**
 * Store 新增方法
 */

/**
 * 切换笔记收藏状态
 * @param {string} id - 笔记 ID
 */
async toggleStar(id) {
  const note = this.state.notes.find(n => n.id === id);
  if (!note) return;

  note.starred = !note.starred;
  note.updatedAt = Date.now();

  await this._persist();
  this.emit('change');
  this.emit('note-starred-changed', { id, starred: note.starred });
}

/**
 * 获取所有收藏的笔记
 * @returns {Array}
 */
getStarredNotes() {
  return this.state.notes.filter(n => n.starred);
}

/**
 * 设置筛选模式
 * @param {string} mode - 'all' 或 'starred'
 */
async setFilterMode(mode) {
  this.state.filterMode = mode;
  await chrome.storage.sync.set({
    [STORAGE_KEYS.FILTER_MODE]: mode,
  });
  this.emit('filter-changed', mode);
}

/**
 * 获取当前筛选后的笔记列表
 * @returns {Array}
 */
getFilteredNotes() {
  const { filterMode, searchQuery } = this.state;

  let notes = this.state.notes;

  // 先按筛选模式过滤
  if (filterMode === 'starred') {
    notes = notes.filter(n => n.starred);
  }

  // 再按搜索关键词过滤
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    notes = notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q)
    );
  }

  return notes;
}
```

### 3.2 初始化扩展

```javascript
/**
 * 初始化：新增 filterMode 状态加载
 */
async init() {
  const result = await chrome.storage.sync.get({
    [STORAGE_KEYS.NOTES]: [],
    [STORAGE_KEYS.ACTIVE_NOTE_ID]: null,
    [STORAGE_KEYS.SIDEBAR_COLLAPSED]: false,
    [STORAGE_KEYS.FILTER_MODE]: 'all',  // ← 新增
  });

  this.state.notes = result[STORAGE_KEYS.NOTES].map(normalizeNote);  // ← 兼容处理
  this.state.activeNoteId = result[STORAGE_KEYS.ACTIVE_NOTE_ID];
  this.state.sidebarCollapsed = result[STORAGE_KEYS.SIDEBAR_COLLAPSED] || false;
  this.state.filterMode = result[STORAGE_KEYS.FILTER_MODE] || 'all';  // ← 新增

  this._sortNotes();
  this._ready = true;
  this.emit('ready');
}

/**
 * 兼容函数：规范化笔记数据
 * @private
 */
function normalizeNote(note) {
  return {
    ...note,
    starred: note.starred ?? false,
  };
}
```

### 3.3 NoteList.js 改造

```javascript
/**
 * 刷新笔记列表 - 使用新的 getFilteredNotes()
 */
_refreshNotes() {
  const notes = this.props.store?.getFilteredNotes() || [];
  this.setState({ notes });
  this._updateContainer();
}

/**
 * 添加筛选 Tab 渲染
 */
render() {
  const container = document.createElement('div');

  // 筛选 Tab
  const filterTabs = this._renderFilterTabs();
  container.appendChild(filterTabs);

  // 笔记列表
  const list = super.render();
  container.appendChild(list);

  return container;
}

/**
 * 渲染筛选 Tab
 * @private
 */
_renderFilterTabs() {
  const container = document.createElement('div');
  container.className = 'filter-tabs';

  const starredCount = this.props.store?.getStarredNotes().length || 0;
  const currentMode = this.props.store?.state.filterMode || 'all';

  // 全部笔记 Tab
  const allTab = this._renderFilterTab('all', t('allNotes'), currentMode === 'all');
  // 收藏 Tab
  const starredTab = this._renderFilterTab('starred', t('starred') + ` (${starredCount})`, currentMode === 'starred');

  container.append(allTab, starredTab);

  // 点击事件
  allTab.onclick = () => this.props.store?.setFilterMode('all');
  starredTab.onclick = () => this.props.store?.setFilterMode('starred');

  return container;
}

/**
 * 监听筛选模式变化
 */
_setupListeners() {
  // ... 现有监听器 ...

  // 监听筛选模式变化
  const unsubscribeFilter = this.props.store?.on('filter-changed', () => {
    this._refreshNotes();
  });
  if (unsubscribeFilter) this._cleanup.push(unsubscribeFilter);

  // 监听收藏状态变化（更新 Tab 数量）
  const unsubscribeStarred = this.props.store?.on('note-starred-changed', () => {
    this._updateFilterTabs();
  });
  if (unsubscribeStarred) this._cleanup.push(unsubscribeStarred);
}
```

### 3.4 ContextMenu.js 改造

```javascript
/**
 * 菜单项配置 - 添加收藏选项
 */
_getMenuItems(note, index, total) {
  const isStarred = note?.starred || false;

  return [
    {
      id: 'toggle-star',
      icon: `<svg class="star-icon ${isStarred ? 'active' : 'inactive'}" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 13.5L2.5 9c-1.5-1.5-1.5-4 0-5.5s3.5-1 5.5 1L8 5l.5-.5c2-2 4-2 5.5-1s1.5 4 0 5.5L8 13.5z"/>
      </svg>`,
      label: isStarred ? t('unfavorite') : t('favorite'),
      action: () => this._handleToggleStar(note),
    },
    { id: 'divider', type: 'divider' },
    // ... 现有菜单项 ...
  ];
}

/**
 * 处理收藏切换
 * @private
 */
async _handleToggleStar(note) {
  await this.props.store?.toggleStar(note.id);
}
```

### 3.5 EditorMoreMenu.js 改造

```javascript
/**
 * 菜单项配置 - 添加收藏选项
 */
constructor(props = {}) {
  super(props);

  // 收藏菜单项（动态更新）
  this._favoriteMenuItem = {
    id: 'toggle-star',
    icon: '',  // 动态生成
    label: '',  // 动态生成
    action: () => this._handleToggleStar(),
  };

  // 插入到删除项之前
  this._menuItems.splice(-2, 0, { id: 'divider-star', type: 'divider' });
  this._menuItems.splice(-2, 0, this._favoriteMenuItem);
}

/**
 * 打开菜单前更新收藏项状态
 */
open(anchor) {
  this._updateFavoriteMenuItem();
  super.open(anchor);
}

/**
 * 更新收藏菜单项
 * @private
 */
_updateFavoriteMenuItem() {
  const note = this.props.store?.getActiveNote();
  const isStarred = note?.starred || false;

  this._favoriteMenuItem.icon = `<svg class="star-icon ${isStarred ? 'active' : 'inactive'}" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 13.5L2.5 9c-1.5-1.5-1.5-4 0-5.5s3.5-1 5.5 1L8 5l.5-.5c2-2 4-2 5.5-1s1.5 4 0 5.5L8 13.5z"/>
  </svg>`;
  this._favoriteMenuItem.label = isStarred ? t('unfavorite') : t('favorite');
}

/**
 * 处理收藏切换
 * @private
 */
async _handleToggleStar() {
  const note = this.props.store?.getActiveNote();
  if (note) {
    await this.props.store?.toggleStar(note.id);
  }
}
```

---

## 四、国际化文案

### 4.1 新增文案（zh_CN/messages.json）

```json
{
  "allNotes": {
    "message": "全部笔记",
    "description": "筛选 Tab：全部笔记"
  },
  "starred": {
    "message": "收藏",
    "description": "筛选 Tab：收藏"
  },
  "favorite": {
    "message": "收藏",
    "description": "收藏操作"
  },
  "unfavorite": {
    "message": "取消收藏",
    "description": "取消收藏操作"
  },
  "noStarredNotes": {
    "message": "没有收藏的笔记",
    "description": "收藏筛选空状态"
  }
}
```

### 4.2 新增文案（en/messages.json）

```json
{
  "allNotes": {
    "message": "All Notes",
    "description": "Filter tab: all notes"
  },
  "starred": {
    "message": "Starred",
    "description": "Filter tab: starred"
  },
  "favorite": {
    "message": "Favorite",
    "description": "Favorite action"
  },
  "unfavorite": {
    "message": "Unfavorite",
    "description": "Unfavorite action"
  },
  "noStarredNotes": {
    "message": "No starred notes",
    "description": "Empty state for starred filter"
  }
}
```

---

## 五、样式调整

### 5.1 筛选 Tab 样式

```css
/* 筛选 Tab 容器 */
.filter-tabs {
  display: flex;
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
}

/* 单个 Tab */
.filter-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 4px;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-bottom: 2px solid transparent;
  transition: all var(--duration-fast);
}

.filter-tab:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-hover);
}

.filter-tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* 星标图标（小） */
.filter-tab .star-icon-small {
  width: 12px;
  height: 12px;
  color: var(--color-star-active);
}

/* 窄化状态调整 */
.note-list-section.narrow .filter-tabs {
  flex-direction: column;
}

.note-list-section.narrow .filter-tab {
  border-bottom: none;
  border-left: 3px solid transparent;
  padding: 10px 4px;
}

.note-list-section.narrow .filter-tab.active {
  border-left-color: var(--color-primary);
}
```

### 5.2 星标图标样式

```css
/* 菜单中的星标图标 */
.menu-item .star-icon {
  width: 14px;
  height: 14px;
  transition: color var(--duration-fast);
}

.menu-item .star-icon.active {
  color: #f59e0b;
}

.menu-item .star-icon.inactive {
  color: #999;
}
```

---

## 六、事件流程

### 6.1 收藏操作流程

```
用户操作                    组件              Store              Storage
   │                        │                 │                   │
点击右键菜单"收藏"           │                 │                   │
   │                   ContextMenu            │                   │
   │                   toggleStar(id) ──────→│                   │
   │                        │          更新 note.starred        │
   │                        │                 │           chrome.storage.sync.set()
   │                        │                 │                   │
   │                   emit('note-starred-changed')              │
   │                        │                                    │
   │                   NoteList 更新 Tab 数量                      │
   │                        │                                    │
   │                   SyncManager 检测变化（跨设备同步）           │
```

### 6.2 筛选操作流程

```
用户操作                    组件              Store              UI
   │                        │                 │                   │
点击"收藏" Tab               │                 │                   │
   │                   NoteList             │                   │
   │                   setFilterMode('starred') ──────────────→│
   │                        │          更新 filterMode         │
   │                        │                 │           更新 Tab 样式
   │                   getFilteredNotes() ──┼──────────────→│
   │                        │          过滤 notes         重新渲染列表
   │                        │                                    │
```

---

## 七、实施计划

### 7.1 开发任务

**数据层（Store.js）**
- [ ] 添加 `starred` 字段兼容处理
- [ ] 添加 `filterMode` 状态
- [ ] 实现 `toggleStar(id)` 方法
- [ ] 实现 `getStarredNotes()` 方法
- [ ] 实现 `setFilterMode(mode)` 方法
- [ ] 实现 `getFilteredNotes()` 方法

**组件层**
- [ ] NoteList.js - 添加筛选 Tab 渲染
- [ ] NoteList.js - 修改 `_refreshNotes()` 使用 `getFilteredNotes()`
- [ ] NoteList.js - 添加筛选模式监听
- [ ] ContextMenu.js - 添加收藏菜单项
- [ ] EditorMoreMenu.js - 添加收藏菜单项
- [ ] 空状态处理 - 无收藏笔记时的提示

**样式层**
- [ ] 添加筛选 Tab 样式
- [ ] 添加星标图标样式
- [ ] 窄化状态适配

**国际化**
- [ ] zh_CN/messages.json - 新增文案
- [ ] en/messages.json - 新增文案

**测试**
- [ ] 本地功能测试
- [ ] 跨设备同步测试

### 7.2 测试要点

| 测试场景 | 预期结果 |
|----------|----------|
| 右键点击笔记 → 点击"收藏" | 笔记被收藏，菜单文字变为"取消收藏" |
| 点击更多菜单 → 点击"收藏" | 笔记被收藏 |
| 点击"收藏" Tab | 只显示已收藏的笔记 |
| 点击"全部笔记" Tab | 显示所有笔记 |
| 收藏后跨设备同步 | 另一设备上显示收藏状态 |
| 窄化状态下切换筛选 | 正确过滤笔记 |
| 无收藏笔记时切换筛选 | 显示空状态提示 |

---

## 八、附录

### 8.1 变更记录

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2025-01-18 | v0.0.6 | 初始版本 |

### 8.2 相关文件

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `src/sidepanel/core/Store.js` | 修改 | 添加收藏相关方法和状态 |
| `src/sidepanel/components/NoteList.js` | 修改 | 添加筛选 Tab，使用新的过滤逻辑 |
| `src/sidepanel/components/ContextMenu.js` | 修改 | 添加收藏菜单项 |
| `src/sidepanel/components/EditorMoreMenu.js` | 修改 | 添加收藏菜单项 |
| `_locales/zh_CN/messages.json` | 修改 | 添加国际化文案 |
| `_locales/en/messages.json` | 修改 | 添加国际化文案 |
| `src/sidepanel/styles.css` | 修改 | 添加筛选 Tab 和星标样式 |
