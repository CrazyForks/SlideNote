# 侧边栏折叠优化 - 技术方案

> **版本**: v0.0.6
> **日期**: 2025-01-19
> **状态**: 开发中

---

## 一、需求概述

优化侧边栏折叠状态，从"完全隐藏"改为"窄化显示"，提升用户体验。

### 核心变更

| 项目 | 当前实现 | 优化后 |
|------|----------|--------|
| 折叠宽度 | 72px | 90px |
| 标题显示 | 纵向 (writing-mode) | 水平（省略号截断） |
| 新建按钮 | 隐藏 | 顶部显示 |
| 展开按钮 | 底部圆形 | 顶部右侧 |
| 收起按钮 | 右边缘中央 | toolbar 右侧 |
| 底部信息 | 显示 | 隐藏 |

---

## 二、CSS 样式修改

### 2.1 侧边栏宽度

```css
/* src/sidepanel/styles.css */

/* 折叠宽度调整 */
.note-list-section.collapsed {
  width: 90px;  /* 原: 72px */
}
```

### 2.2 折叠状态标题样式

```css
/* 折叠状态：标题水平显示（截断） */
.note-list-section.collapsed .note-item-title {
  writing-mode: horizontal-tb;  /* 原: vertical-rl */
  text-orientation: mixed;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  line-height: 1.4;
  width: 100%;
}

/* 删除纵向文字相关样式 */
/* .note-list-section.collapsed .note-item-title {
  writing-mode: vertical-rl;    ❌ 删除
  max-height: 72px;              ❌ 删除
  letter-spacing: 1px;           ❌ 删除
} */
```

### 2.3 折叠状态选中效果

```css
/* 折叠状态：选中时左侧蓝条（保持一致） */
.note-list-section.collapsed .note-item.active::before {
  display: block;  /* 原: display: none */
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  background: var(--color-primary);
  border-radius: 0 2px 2px 0;
}

.note-list-section.collapsed .note-item.active {
  background: var(--color-bg-primary);  /* 原: var(--color-bg-active) */
  box-shadow: var(--shadow-sm);
}
```

### 2.4 折叠状态笔记项样式

```css
.note-list-section.collapsed .note-item {
  padding: 8px 4px;      /* 原: 6px 2px */
  margin-bottom: 2px;
  min-height: 36px;      /* 新增 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.note-list-section.collapsed .note-list {
  padding: 6px 4px;      /* 原: var(--spacing-xs) 2px */
}
```

### 2.5 新增：折叠状态顶部按钮区域

```css
/* 折叠状态：顶部按钮区域 */
.note-list-section.collapsed .top-actions {
  padding: 8px 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: var(--color-bg-secondary);
}

.note-list-section.collapsed .toolbar,
.note-list-section.collapsed .note-list-footer {
  display: none;  /* 保持原有逻辑 */
}
```

### 2.6 新增：新建按钮（折叠态）

```css
/* 折叠状态：新建按钮 */
.new-btn-collapsed {
  width: 36px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  background: white;
  transition: all var(--duration-fast);
  flex-shrink: 0;
}

.new-btn-collapsed:hover {
  background: var(--color-primary-light);
}

.new-btn-collapsed svg {
  width: 14px;
  height: 14px;
}
```

### 2.7 新增：展开按钮（折叠态）

```css
/* 折叠状态：展开按钮 */
.expand-btn-small {
  width: 36px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-md);
  cursor: pointer;
  background: white;
  transition: all var(--duration-fast);
  flex-shrink: 0;
}

.expand-btn-small:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-secondary);
}

.expand-btn-small svg {
  width: 14px;
  height: 14px;
}
```

### 2.8 新增：收起按钮（展开态，在 toolbar 右侧）

```css
/* 展开状态：toolbar 布局调整 */
.toolbar {
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  height: 44px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* 收起按钮（展开状态，在 toolbar 右侧） */
.collapse-btn-inline {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-md);
  cursor: pointer;
  background: white;
  transition: all var(--duration-fast);
  flex-shrink: 0;
}

.collapse-btn-inline:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-secondary);
}

.collapse-btn-inline svg {
  width: 14px;
  height: 14px;
}
```

### 2.9 删除：旧的收起/展开按钮样式

```css
/* 删除右边缘中央的收起按钮样式 */
/* .sidebar-collapse-btn { ... } ❌ 删除 */
/* .sidebar-expand-btn { ... } ❌ 删除 */
```

---

## 三、组件修改

### 3.1 Toolbar.js

**修改内容**：重构 render 方法，支持左/右分区

```javascript
// src/sidepanel/components/Toolbar.js

export class Toolbar {
  constructor(props = {}) {
    this.props = props;
    this.state = {
      isSearchExpanded: false,
      searchValue: '',
      isSidebarCollapsed: props.isSidebarCollapsed || false,
    };
    this.el = null;
    this._searchContainer = null;
    this._searchInput = null;
    this._newNoteBtnText = null;
    this._searchBtn = null;
    this._collapseBtn = null;  // 新增：收起按钮引用
  }

  render() {
    const container = document.createElement('div');
    container.className = 'toolbar';

    // 左侧区域
    const leftArea = document.createElement('div');
    leftArea.className = 'toolbar-left';

    // 搜索区域
    this._searchContainer = document.createElement('div');
    this._searchContainer.className = 'search-container';
    this._renderSearchArea(this._searchContainer);
    leftArea.appendChild(this._searchContainer);

    // 新建按钮
    const newNoteBtn = this._renderNewNoteButton();
    leftArea.appendChild(newNoteBtn);

    container.appendChild(leftArea);

    // 右侧区域
    const rightArea = document.createElement('div');
    rightArea.className = 'toolbar-right';

    // 收起按钮
    if (!this.state.isSidebarCollapsed) {
      this._collapseBtn = this._renderCollapseButton();
      rightArea.appendChild(this._collapseBtn);
    }

    container.appendChild(rightArea);

    this.el = container;
    return container;
  }

  /**
   * 渲染收起按钮
   * @private
   */
  _renderCollapseButton() {
    const btn = document.createElement('div');
    btn.className = 'collapse-btn-inline';
    btn.title = '收起侧边栏';
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="11 17 6 12 11 7"/>
      </svg>
    `;
    btn.onclick = () => {
      this.props.bus?.emit('sidebar:collapse-request');
    };
    return btn;
  }

  /**
   * 渲染新建按钮（提取为独立方法）
   * @private
   */
  _renderNewNoteButton() {
    const btn = document.createElement('button');
    btn.className = 'btn-new-note';
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      <span></span>
    `;
    this._newNoteBtnText = btn.querySelector('span');
    this._updateNewNoteText();
    btn.onclick = () => {
      this.props.bus?.emit('note:create');
    };
    return btn;
  }

  // ... 其他方法保持不变
}
```

### 3.2 app.js

**修改内容**：
1. 删除右边缘中央的收起按钮
2. 添加折叠状态下的顶部按钮区域
3. 调整事件处理逻辑

```javascript
// src/sidepanel/app.js

class App {
  constructor() {
    this.store = null;
    this.syncManager = null;
    this.components = {};
    this.dialog = null;
    this._listSection = null;
    this._topActions = null;  // 新增：折叠状态顶部按钮区域引用
  }

  /**
   * 挂载组件
   * @private
   */
  _mountComponents() {
    const container = document.querySelector('#app');
    if (!container) {
      console.error('App container not found');
      return;
    }

    // 创建左侧笔记列表区域
    const listSection = document.createElement('div');
    listSection.className = 'note-list-section';
    this._listSection = listSection;

    // 初始化折叠状态
    const isCollapsed = this.store?.isSidebarCollapsed() || false;
    if (isCollapsed) {
      listSection.classList.add('collapsed');
      this._renderCollapsedState(listSection);
    } else {
      this._renderExpandedState(listSection);
    }

    // 创建右侧内容区域
    const contentSection = document.createElement('div');
    contentSection.className = 'note-content-section';

    // 笔记编辑器
    this.components.noteEditor = new NoteEditor({ store: this.store, bus });
    const editorEl = this.components.noteEditor.render();
    this.components.noteEditor.el = editorEl;
    contentSection.appendChild(editorEl);

    // 添加到容器
    container.append(listSection, contentSection);
  }

  /**
   * 渲染展开状态
   * @private
   */
  _renderExpandedState(listSection) {
    // 清空现有内容
    listSection.innerHTML = '';

    // 顶部工具栏
    this.components.toolbar = new Toolbar({
      bus,
      isSidebarCollapsed: false
    });
    const toolbarEl = this.components.toolbar.render();
    listSection.appendChild(toolbarEl);

    // 笔记列表
    this.components.noteList = new NoteList({ store: this.store, bus });
    const noteListEl = this.components.noteList.render();
    this.components.noteList.el = noteListEl;
    listSection.appendChild(noteListEl);

    // 底部页脚
    const footer = this._renderFooter();
    listSection.appendChild(footer);
  }

  /**
   * 渲染折叠状态
   * @private
   */
  _renderCollapsedState(listSection) {
    // 清空现有内容
    listSection.innerHTML = '';

    // 顶部按钮区域
    this._topActions = this._renderTopActions();
    listSection.appendChild(this._topActions);

    // 笔记列表（复用现有组件）
    this.components.noteList = new NoteList({ store: this.store, bus });
    const noteListEl = this.components.noteList.render();
    this.components.noteList.el = noteListEl;
    listSection.appendChild(noteListEl);
  }

  /**
   * 渲染顶部按钮区域（折叠状态）
   * @private
   */
  _renderTopActions() {
    const container = document.createElement('div');
    container.className = 'top-actions';

    // 新建按钮
    const newBtn = document.createElement('div');
    newBtn.className = 'new-btn-collapsed';
    newBtn.title = '新建笔记';
    newBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    `;
    newBtn.onclick = () => {
      bus.emit('note:create');
    };

    // 展开按钮
    const expandBtn = document.createElement('div');
    expandBtn.className = 'expand-btn-small';
    expandBtn.title = '展开侧边栏';
    expandBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 14 12 9 7"/>
      </svg>
    `;
    expandBtn.onclick = () => {
      this._toggleSidebar();
    };

    container.append(newBtn, expandBtn);
    return container;
  }

  /**
   * 渲染底部页脚
   * @private
   */
  _renderFooter() {
    const footer = document.createElement('div');
    footer.className = 'note-list-footer';

    const appFooter = document.createElement('div');
    appFooter.className = 'app-footer';

    // ... 现有的 footer 渲染逻辑

    return footer;
  }

  /**
   * 设置全局事件监听
   * @private
   */
  _setupGlobalListeners() {
    // 新建笔记 - 延迟触发编辑模式
    bus.on('note:create', async () => {
      // 侧边栏折叠时自动展开
      await this.expandSidebar();
      const result = await this.store.createNote();
      bus.emit('note:select', result.id, { isNew: true });
      setTimeout(() => {
        bus.emit('editor:set-edit-mode');
      }, 300);
    });

    // 删除笔记请求
    bus.on('note:delete-request', (note) => {
      this._showDeleteConfirm(note);
    });

    // 搜索展开时自动展开侧边栏
    bus.on('search:expand', async () => {
      await this.expandSidebar();
    });

    // 侧边栏展开请求（折叠状态下点击笔记时）
    bus.on('sidebar:expand-request', async () => {
      await this.expandSidebar();
    });

    // 侧边栏收起请求（新增）
    bus.on('sidebar:collapse-request', async () => {
      await this._toggleSidebar();
    });
  }

  /**
   * 切换侧边栏折叠状态
   * @private
   */
  async _toggleSidebar() {
    const isCollapsed = this.store.isSidebarCollapsed();
    const newState = !isCollapsed;

    if (newState) {
      // 切换到折叠状态
      this._listSection.classList.add('collapsed');
      this._renderCollapsedState(this._listSection);
    } else {
      // 切换到展开状态
      this._listSection.classList.remove('collapsed');
      this._renderExpandedState(this._listSection);
    }

    // 持久化状态
    await this.store.setSidebarCollapsed(newState);
  }

  /**
   * 展开侧边栏
   */
  async expandSidebar() {
    if (!this.store.isSidebarCollapsed()) return;

    this._listSection.classList.remove('collapsed');
    this._renderExpandedState(this._listSection);
    await this.store.setSidebarCollapsed(false);
  }

  /**
   * 初始化侧边栏折叠状态
   * @private
   */
  _initSidebarState() {
    // 已移到 _mountComponents 中处理
  }

  // ... 其他方法保持不变
}
```

### 3.3 NoteList.js

**修改内容**：无需修改，现有逻辑兼容折叠状态

---

## 四、Store.js 修改

**修改内容**：无需修改，现有 API 已支持

```javascript
// src/sidepanel/core/Store.js

// 现有方法已足够
async setSidebarCollapsed(collapsed) {
  this.state.sidebarCollapsed = collapsed;
  await chrome.storage.sync.set({
    [STORAGE_KEYS.SIDEBAR_COLLAPSED]: collapsed,
  });
  this.emit('sidebar-toggled', collapsed);
}

isSidebarCollapsed() {
  return this.state.sidebarCollapsed;
}
```

---

## 五、i18n 国际化

**新增文案**：

```json
// _locales/zh_CN/messages.json
{
  "collapseSidebar": {
    "message": "收起侧边栏"
  },
  "expandSidebar": {
    "message": "展开侧边栏"
  }
}

// _locales/en/messages.json
{
  "collapseSidebar": {
    "message": "Collapse sidebar"
  },
  "expandSidebar": {
    "message": "Expand sidebar"
  }
}
```

---

## 六、实施计划

### 6.1 开发步骤

| 步骤 | 任务 | 文件 | 预估时间 |
|------|------|------|----------|
| 1 | 修改折叠宽度 CSS | styles.css | 5min |
| 2 | 修改折叠状态标题样式 | styles.css | 10min |
| 3 | 新增顶部按钮区域样式 | styles.css | 15min |
| 4 | 新建/展开/收起按钮样式 | styles.css | 15min |
| 5 | 删除旧的按钮样式 | styles.css | 5min |
| 6 | 重构 Toolbar 组件 | Toolbar.js | 20min |
| 7 | 修改 app.js 渲染逻辑 | app.js | 30min |
| 8 | 添加 i18n 文案 | _locales/ | 5min |
| 9 | 测试与调试 | - | 20min |

**总计**：约 2 小时

### 6.2 验收标准

| 检查项 | 预期结果 |
|--------|----------|
| 折叠宽度 | 90px |
| 标题显示 | 水平，超长省略号 |
| 选中效果 | 左侧蓝条 + 白色背景 |
| 新建按钮 | 折叠时顶部显示 |
| 展开按钮 | 折叠时顶部右侧 |
| 收起按钮 | 展开时 toolbar 右侧 |
| 自动展开 | 新建笔记时自动展开 |
| 状态持久化 | 刷新后保持状态 |

---

## 七、兼容性说明

### 7.1 向后兼容

- Chrome Storage 中的 `slidenote_sidebar_collapsed` 键保持不变
- 已有的折叠状态会自动迁移到新设计

### 7.2 浏览器兼容

- Chrome 114+（Side Panel API 要求）
- 使用标准 CSS，无兼容性问题

---

## 八、风险与注意事项

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 折叠后标题过长被截断 | 中 | 保持标题可读性，优先显示前 6-8 个字符 |
| 90px 宽度仍不够 | 低 | 可在后续版本调整为 100px |
| 按钮位置变更影响老用户 | 低 | 按钮仍在顶部区域，肌肉记忆可迁移 |

---

## 九、后续优化方向

1. **折叠状态搜索**：考虑在折叠态下添加搜索入口
2. **宽度可配置**：允许用户自定义折叠宽度（80/90/100px）
3. **快捷键**：Cmd/Ctrl + [ 收起，Cmd/Ctrl + ] 展开
