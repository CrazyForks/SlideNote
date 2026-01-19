# v0.0.6 产品需求文档

> **版本**: v0.0.6
> **日期**: 2025-01-19
> **状态**: ✅ 已发布

---

## 一、需求概述

本次更新包含的需求：

| 需求 | 类型 | 优先级 | 状态 |
|------|------|--------|------|
| 删除笔记 Bug 修复 | 修复 | P0 | ✅ 已完成 |
| 夜间模式适配 | 新增 | P1 | ✅ 已完成 |
| Toolbar 设计优化 | 优化 | P1 | ✅ 已完成 |
| 星标/收藏功能 | 新增 | P0 | 移至 v0.0.7 |
| 侧边栏折叠优化 | 优化 | P1 | 移至 v0.0.7 |

---

## 二、需求一：星标/收藏功能

### 2.1 需求描述

为笔记添加星标（收藏）功能，让常用笔记可以快速访问。

### 2.2 设计方案

#### 数据结构

```javascript
// 笔记对象新增字段
{
  id: "note_xxx",
  title: "标题",
  content: "内容",
  starred: false,  // ← 新增：是否已收藏
  createdAt: number,
  updatedAt: number,
  order: number
}
```

#### UI 设计

**笔记列表项添加星标按钮**：

```
┌─────────────────────────────┐
│ ⭐ [笔记标题]              │  ← 星标显示在标题前
│    预览内容...              │
└─────────────────────────────┘
```

**折叠状态下分组**：

```
┌─────────────────┐
│ 📌 全部笔记 (12)│  ← 默认分组
│ ⭐ 收藏 (3)     │  ← 收藏分组（仅在有收藏时显示）
│ ─────────────── │
│ ⭐ AI提示词     │
│   笔记2        │
│   笔记3        │
│ ⭐ 常用命令     │
│   ...          │
└─────────────────┘
```

#### 交互设计

| 操作 | 效果 |
|------|------|
| 点击星标图标 | 切换收藏状态 |
| 点击"收藏"分组 | 筛选已收藏的笔记 |
| 点击"全部笔记" | 显示所有笔记 |

#### 星标按钮样式

```css
/* 星标按钮位置 */
.note-item-star {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  cursor: pointer;
  opacity: 0.3;
  transition: opacity 0.2s;
}

.note-item-star:hover {
  opacity: 0.7;
}

.note-item-star.starred {
  opacity: 1;
  color: #f59e0b; /* 金色 */
}

/* 有星标时标题留出空间 */
.note-item.has-star .note-item-title {
  padding-left: 20px;
}
```

#### 分组筛选逻辑

```javascript
// 筛选模式
const FILTER_MODES = {
  ALL: 'all',      // 全部笔记
  STARRED: 'starred' // 已收藏
};

// Store 新增状态
state = {
  notes: [],
  activeNoteId: null,
  filterMode: 'all',  // ← 新增：筛选模式
  // ...
}
```

### 2.3 技术实现要点

1. **Store.js 新增方法**：
   - `toggleStar(id)` - 切换星标状态
   - `getStarredNotes()` - 获取所有收藏的笔记
   - `setFilterMode(mode)` - 设置筛选模式

2. **NoteList.js 修改**：
   - 渲染星标按钮
   - 处理星标点击事件
   - 支持按筛选模式过滤笔记

3. **i18n 新增文案**：
   - `starred`: "收藏" / "Starred"
   - `allNotes`: "全部笔记" / "All Notes"
   - `starredOnly`: "仅收藏" / "Starred Only"

---

## 三、需求二：侧边栏折叠优化

### 3.1 当前问题

```
展开状态 (180px)          折叠状态 (40px)
┌──────────────┐          ┌──┐
│ Toolbar      │          │  │
│ ├────────────┤          │  │
│ 笔记1        │   →→→    │⊕ │  ← 完全看不到笔记
│ 笔记2        │          │  │
│ 笔记3        │          │  │
│ Footer       │          │⊕ │
└──────────────┘          └──┘
```

**问题**：折叠后完全看不到笔记，无法快速切换。

### 3.2 优化方案

#### 方案设计

```
展开状态 (180px)            窄化状态 (80px)
┌──────────────┐           ┌────┐
│ Toolbar      │           │⋮⋮ │  ← 收起按钮
│ ├────────────┤           ├───┤
│ ⭐ 笔记1     │           │笔记1│  ← 只显示标题
│   笔记2      │   →→→     │笔记2│
│   笔记3      │           │笔记3│
│ Footer       │           │笔记4│
└──────────────┘           └────┘
```

#### 折叠状态设计

| 属性 | 展开状态 | 窄化状态 |
|------|----------|----------|
| 宽度 | 180px | 80px |
| Toolbar | 显示 | 隐藏（或只显示搜索图标） |
| Footer | 显示 | 隐藏 |
| 笔记项 | 标题+预览 | 仅标题（单行截断） |
| 星标按钮 | 显示 | 显示 |
| 分组筛选 | 显示 | 顶部下拉/切换 |

#### 样式调整

```css
/* 窄化状态 */
.note-list-section.narrow {
  width: 80px;
}

/* 窄化时隐藏 */
.note-list-section.narrow .toolbar,
.note-list-section.narrow .note-list-footer {
  display: none;
}

/* 窄化时笔记项样式 */
.note-list-section.narrow .note-item {
  padding: var(--spacing-sm) 4px;
}

.note-list-section.narrow .note-item-preview {
  display: none;
}

.note-list-section.narrow .note-item-title {
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  line-height: 1.4;
}

/* 窄化时星标居中 */
.note-list-section.narrow .note-item-star {
  position: static;
  margin: 0 auto 4px;
  display: block;
}

/* 窄化时分组选择器 */
.note-list-section.narrow .filter-selector {
  display: flex;
  justify-content: center;
  padding: 8px 4px;
  border-bottom: 1px solid var(--color-border);
}
```

#### 状态命名调整

```javascript
// 原状态命名：collapsed (折叠)
// 新状态命名：
const SIDEBAR_STATE = {
  EXPANDED: 'expanded',   // 展开状态 (180px)
  NARROW: 'narrow'        // 窄化状态 (80px)
};
```

### 3.3 交互优化

| 操作 | 效果 |
|------|------|
| 点击收起按钮 | 从展开 → 窄化 |
| 窄化状态下点击展开按钮 | 从窄化 → 展开 |
| 窄化状态下点击笔记项 | 正常切换，可自动展开编辑器 |
| 窄化状态下点击筛选 | 切换"全部/收藏"筛选 |

---

## 四、需求三：删除笔记 Bug 修复

### 4.1 Bug 描述

**复现步骤**：
1. 打开一条笔记进行编辑
2. 右键该笔记 → 选择"删除"
3. 确认删除

**预期结果**：编辑器清空，或显示下一条笔记

**实际结果**：编辑器仍显示已删除的笔记内容

### 4.2 问题分析

```javascript
// Store.deleteNote() 的逻辑
async deleteNote(id) {
  // ...删除笔记
  if (this.state.activeNoteId === id) {
    this.state.activeNoteId = this.state.notes[0]?.id || null;
    // ❌ 问题：更新了 activeNoteId，但没有触发 note:select 事件
  }
  this.emit('note-deleted', id);  // NoteEditor 不监听此事件
}
```

**根本原因**：
1. `Store` 更新了 `activeNoteId`，但没发出 `note:select` 事件
2. `NoteEditor` 只监听 `note:select` 和 `note-updated`，不监听 `note-deleted`

### 4.3 修复方案

#### 方案 A：Store 发出 note:select 事件（推荐）

```javascript
// Store.js
async deleteNote(id) {
  // ...
  if (this.state.activeNoteId === id) {
    const nextNoteId = this.state.notes[0]?.id || null;
    this.state.activeNoteId = nextNoteId;

    // ✅ 发出 note:select 事件，让编辑器更新
    if (nextNoteId) {
      this.emit('note:select', nextNoteId, { isAfterDelete: true });
    }
  }
  // ...
}
```

#### 方案 B：NoteEditor 监听 note-deleted 事件

```javascript
// NoteEditor.js
_setupListeners() {
  // ...
  const unsubscribeDeleted = this.props.bus?.on('note-deleted', (deletedId) => {
    if (this.state.note?.id === deletedId) {
      this.setState({ note: null });
      this._updateContainer();  // 显示空状态
    }
  });
  if (unsubscribeDeleted) this._cleanup.push(unsubscribeDeleted);
}
```

**推荐**：同时使用方案 A 和方案 B，确保状态同步。

---

## 五、实施计划

### 5.1 开发顺序

| 步骤 | 任务 | 预估工时 |
|------|------|----------|
| 1 | 数据结构扩展（starred 字段） | 30min |
| 2 | Store 方法实现（星标、筛选） | 1h |
| 3 | NoteList 组件改造（星标按钮、筛选） | 2h |
| 4 | 国际化文案 | 15min |
| 5 | 侧边栏折叠状态重构 | 1.5h |
| 6 | CSS 样式调整 | 1h |
| 7 | 删除 Bug 修复 | 30min |
| 8 | 测试与调试 | 1h |

**总计**：约 8 小时

### 5.2 验收标准

**星标功能**：
- [ ] 点击星标可切换收藏状态
- [ ] 收藏状态跨设备同步
- [ ] 筛选"收藏"只显示已收藏笔记
- [ ] 筛选"全部"显示所有笔记

**折叠优化**：
- [ ] 窄化状态下显示笔记标题（单行截断）
- [ ] 窄化状态下可正常点击切换笔记
- [ ] 状态持久化
- [ ] 动画流畅

**Bug 修复**：
- [ ] 删除笔记后编辑器正确清空或切换
- [ ] 删除最后一条笔记显示空状态

---

## 六、UI 参考图

### 6.1 星标按钮设计

```
展开状态：
┌────────────────────────────┐
│ ⭐ AI 提示词模板           │  ← 星标+标题
│    用于 DeepSeek 写作...   │
└────────────────────────────┘

窄化状态：
┌──────┐
│  ★   │  ← 星标居中
│AI提示 │  ← 标题居中截断
└──────┘
```

### 6.2 筛选器设计

```
展开状态（顶部 Tab）：
┌────────────────────────────┐
│ [全部笔记] [⭐ 收藏 (3)]   │
├────────────────────────────┤
│ ⭐ AI 提示词               │
│   常用命令                 │
└────────────────────────────┘

窄化状态（下拉或图标切换）：
┌──────┐
│  全部 │  ← 点击切换
│  ⭐   │  ← 点击切换
├──────┤
│  ★   │
│AI提示 │
│  ★   │
│常用命令│
└──────┘
```

---

> **设计原则**：保持简单，符合"便利贴"定位，零维护成本。
