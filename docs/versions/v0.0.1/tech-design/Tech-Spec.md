# SlideNote v0.0.1 技术方案文档

> **Slide notes, always by your side**
> **侧边笔记，常伴左右**

## 文档信息

| 项目 | 内容 |
|------|------|
| 产品名称 | SlideNote（侧边笔记） |
| 版本号 | v0.0.1 |
| 文档类型 | 技术方案 |
| 创建日期 | 2025-01-11 |
| 状态 | 设计中 |

---

## 一、技术选型

### 1.1 技术栈决策

| 层级 | 技术选择 | 理由 |
|------|----------|------|
| 运行时 | Vanilla JS (ES6+) | 无依赖、轻量、加载快 |
| 构建工具 | Vite | 快速 HMR、简单配置 |
| 样式 | 原生 CSS + CSS Variables | 无需预处理器、易维护 |
| 类型 | JSDoc + TypeScript Check | 类型提示、无需编译 |
| 存储 | Chrome Storage Sync API | 自带跨设备同步 |
| 图标 | SVG 内联 | 单文件、无额外请求 |

### 1.2 不使用框架的理由

1. **轻量**: 插件需要快速加载，React/Vue 等框架会增加 ~100KB+
2. **简单**: 功能单一，不需要复杂的状态管理
3. **稳定**: 无框架升级风险，代码长期可用
4. **可控**: 完全掌控渲染逻辑，调试更直接

---

## 二、项目结构

### 2.1 最终目录结构

```
slidenote/
├── manifest.json              # Chrome 扩展清单
├── package.json               # 项目配置
├── vite.config.js             # Vite 构建配置
├── tsconfig.json              # TS 类型检查配置
├── .eslintrc.js               # 代码规范
├── .gitignore
│
├── public/                    # 静态资源（不经过构建）
│   └── icons/                 # 插件图标
│       ├── icon-16.png
│       ├── icon-32.png
│       ├── icon-48.png
│       └── icon-128.png
│
├── src/
│   ├── sidepanel/             # 侧边栏页面（主入口）
│   │   ├── index.html         # HTML 模板
│   │   ├── app.js             # 应用入口
│   │   ├── styles.css         # 样式文件
│   │   │
│   │   ├── core/              # 核心模块
│   │   │   ├── Store.js       # 数据存储管理
│   │   │   └── EventBus.js    # 事件总线
│   │   │
│   │   ├── components/        # UI 组件
│   │   │   ├── NoteList.js    # 笔记列表
│   │   │   ├── NoteEditor.js  # 笔记编辑器
│   │   │   ├── SearchBar.js   # 搜索栏
│   │   │   └── ConfirmDialog.js  # 确认弹窗
│   │   │
│   │   └── utils/             # 工具函数
│   │       ├── dom.js         # DOM 操作
│   │       ├── debounce.js    # 防抖/节流
│   │       ├── format.js      # 格式化
│   │       └── icons.js       # SVG 图标
│
├── dist/                      # 构建输出（.gitignore）
└── docs/                      # 项目文档
```

### 2.2 文件职责说明

| 文件/目录 | 职责 |
|----------|------|
| `manifest.json` | Chrome 扩展配置文件，定义权限、入口等 |
| `sidepanel/index.html` | 侧边栏 HTML，挂载点 |
| `sidepanel/app.js` | 应用初始化、组件组装 |
| `core/Store.js` | 数据层，封装 Chrome Storage API |
| `core/EventBus.js` | 组件间通信 |
| `components/` | 各 UI 组件实现 |
| `utils/` | 通用工具函数 |

---

## 三、数据设计

### 3.1 数据结构（TypeScript 定义）

```typescript
/**
 * 单条笔记数据结构
 */
interface Note {
  /** 唯一标识符: `note_${timestamp}_${random}` */
  id: string;

  /** 笔记标题，默认"未命名笔记" */
  title: string;

  /** 笔记内容，纯文本 */
  content: string;

  /** 创建时间戳（毫秒） */
  createdAt: number;

  /** 最后更新时间戳（毫秒） */
  updatedAt: number;
}

/**
 * 应用状态
 */
interface AppState {
  /** 所有笔记 */
  notes: Note[];

  /** 当前选中的笔记 ID */
  activeNoteId: string | null;

  /** 搜索关键词（内存中，不持久化） */
  searchQuery: string;
}

/**
 * Chrome Storage 存储结构
 */
interface StorageData {
  notes: Note[];
  activeNoteId: string | null;
}
```

### 3.2 存储键设计

```javascript
const STORAGE_KEYS = {
  /** 笔记列表 */
  NOTES: 'slidenote_notes',

  /** 当前选中的笔记 ID */
  ACTIVE_NOTE_ID: 'slidenote_active_id',

  /** 设置（预留） */
  SETTINGS: 'slidenote_settings',
};
```

### 3.3 数据验证

```javascript
/**
 * 验证笔记数据完整性
 */
function validateNote(note) {
  return (
    typeof note === 'object' &&
    typeof note.id === 'string' &&
    typeof note.title === 'string' &&
    typeof note.content === 'string' &&
    typeof note.createdAt === 'number' &&
    typeof note.updatedAt === 'number'
  );
}

/**
 * 迁移旧数据（如果需要）
 */
function migrateData(oldData) {
  // 预留：处理版本升级时的数据迁移
  return oldData;
}
```

---

## 四、核心模块设计

### 4.1 Store - 数据存储层

```javascript
/**
 * 数据存储管理类
 * 封装 Chrome Storage API，提供统一的数据操作接口
 *
 * @example
 * const store = new Store();
 * await store.init();
 * const note = await store.createNote();
 */
class Store extends EventEmitter {
  constructor() {
    super();
    /** @type {AppState} */
    this.state = {
      notes: [],
      activeNoteId: null,
      searchQuery: '',
    };
    this._ready = false;
  }

  /**
   * 初始化：从 Chrome Storage 加载数据
   */
  async init() {
    const result = await chrome.storage.sync.get({
      [STORAGE_KEYS.NOTES]: [],
      [STORAGE_KEYS.ACTIVE_NOTE_ID]: null,
    });

    this.state.notes = result[STORAGE_KEYS.NOTES] || [];
    this.state.activeNoteId = result[STORAGE_KEYS.ACTIVE_NOTE_ID];

    // 按创建时间倒序排序
    this._sortNotes();

    this._ready = true;
    this.emit('ready');
  }

  /**
   * 创建新笔记
   * @returns {Promise<Note>}
   */
  async createNote() {
    const note = {
      id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title: '未命名笔记',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.state.notes.unshift(note);
    this.state.activeNoteId = note.id;

    await this._persist();
    this.emit('change');
    this.emit('note-created', note);

    return note;
  }

  /**
   * 更新笔记
   * @param {string} id
   * @param {Partial<Omit<Note, 'id' | 'createdAt'>>} changes
   */
  async updateNote(id, changes) {
    const note = this.state.notes.find(n => n.id === id);
    if (!note) return;

    Object.assign(note, changes, { updatedAt: Date.now() });

    await this._persist();
    this.emit('change');
    this.emit('note-updated', note);
  }

  /**
   * 删除笔记
   * @param {string} id
   */
  async deleteNote(id) {
    const index = this.state.notes.findIndex(n => n.id === id);
    if (index === -1) return;

    this.state.notes.splice(index, 1);

    // 如果删除的是当前笔记，切换到下一条
    if (this.state.activeNoteId === id) {
      this.state.activeNoteId = this.state.notes[0]?.id || null;
    }

    await this._persist();
    this.emit('change');
    this.emit('note-deleted', id);
  }

  /**
   * 设置当前激活的笔记
   * @param {string} id
   */
  async setActiveNote(id) {
    this.state.activeNoteId = id;
    await chrome.storage.sync.set({
      [STORAGE_KEYS.ACTIVE_NOTE_ID]: id,
    });
    this.emit('active-changed', id);
  }

  /**
   * 搜索笔记
   * @param {string} query
   * @returns {Note[]}
   */
  searchNotes(query) {
    if (!query.trim()) return this.state.notes;

    const q = query.toLowerCase();
    return this.state.notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q)
    );
  }

  /**
   * 获取当前激活的笔记
   * @returns {Note|null}
   */
  getActiveNote() {
    return this.state.notes.find(n => n.id === this.state.activeNoteId) || null;
  }

  /**
   * 持久化到 Chrome Storage
   * @private
   */
  async _persist() {
    await chrome.storage.sync.set({
      [STORAGE_KEYS.NOTES]: this.state.notes,
      [STORAGE_KEYS.ACTIVE_NOTE_ID]: this.state.activeNoteId,
    });
  }

  /**
   * 内部排序
   * @private
   */
  _sortNotes() {
    this.state.notes.sort((a, b) => b.createdAt - a.createdAt);
  }
}

/**
 * 简单的 EventEmitter 实现
 */
class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(event, callback) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(callback);
    return this;
  }

  emit(event, ...args) {
    const callbacks = this._events[event] || [];
    callbacks.forEach(cb => cb(...args));
    return this;
  }

  off(event, callback) {
    const callbacks = this._events[event] || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
    return this;
  }
}
```

### 4.2 EventBus - 事件总线

```javascript
/**
 * 全局事件总线
 * 用于组件间通信
 *
 * @example
 * bus.on('note:select', (id) => console.log(id));
 * bus.emit('note:select', 'note_123');
 */
class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * 订阅事件
   * @param {string} event
   * @param {Function} callback
   * @returns {Function} 取消订阅函数
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // 返回取消订阅函数
    return () => this.off(event, callback);
  }

  /**
   * 发布事件
   * @param {string} event
   * @param {*} data
   */
  emit(event, data) {
    const callbacks = this.events[event] || [];
    callbacks.forEach(cb => cb(data));
  }

  /**
   * 取消订阅
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    if (!this.events[event]) return;
    const index = this.events[event].indexOf(callback);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }

  /**
   * 清空所有订阅
   */
  clear() {
    this.events = {};
  }
}

// 全局实例
const bus = new EventBus();
```

### 4.3 AutoSaver - 自动保存

```javascript
/**
 * 自动保存管理器
 * 防抖延迟保存，避免频繁写入
 *
 * @example
 * const saver = new AutoSaver(store, 1000);
 * saver.save('note_123', { title: '新标题' });
 */
class AutoSaver {
  /**
   * @param {Store} store
   * @param {number} delay 延迟时间（毫秒）
   */
  constructor(store, delay = 1000) {
    this.store = store;
    this.delay = delay;
    this.timer = null;
    this.pendingChanges = new Map();
  }

  /**
   * 保存（防抖）
   * @param {string} noteId
   * @param {object} changes
   */
  save(noteId, changes) {
    // 合并待保存的变更
    const existing = this.pendingChanges.get(noteId) || {};
    this.pendingChanges.set(noteId, { ...existing, ...changes });

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this._flush();
    }, this.delay);
  }

  /**
   * 立即保存
   * @param {string} noteId
   * @param {object} changes
   */
  async saveNow(noteId, changes) {
    this.cancel();
    await this.store.updateNote(noteId, changes);
  }

  /**
   * 取消待保存
   */
  cancel() {
    clearTimeout(this.timer);
    this.pendingChanges.clear();
  }

  /**
   * 刷新待保存的变更
   * @private
   */
  async _flush() {
    for (const [noteId, changes] of this.pendingChanges) {
      await this.store.updateNote(noteId, changes);
    }
    this.pendingChanges.clear();

    // 触发保存提示
    bus.emit('save:complete');
  }
}
```

### 4.4 SyncManager - 同步管理

```javascript
/**
 * 跨设备同步管理
 * 监听 Chrome Storage 变化，处理多端同步
 */
class SyncManager {
  /**
   * @param {Store} store
   */
  constructor(store) {
    this.store = store;
    this._setupListener();
  }

  /**
   * 设置监听器
   * @private
   */
  _setupListener() {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'sync') return;

      // 检查是否有我们的数据变化
      const hasChanges =
        changes[STORAGE_KEYS.NOTES] ||
        changes[STORAGE_KEYS.ACTIVE_NOTE_ID];

      if (hasChanges) {
        this._handleSyncChange();
      }
    });
  }

  /**
   * 处理同步变化
   * @private
   */
  async _handleSyncChange() {
    // 重新加载数据
    await this.store.init();

    // 通知 UI 刷新
    bus.emit('sync:complete');

    // 显示同步提示
    bus.emit('toast:show', { message: '已同步', type: 'info' });
  }

  /**
   * 手动触发同步检查
   */
  async checkSync() {
    const bytesInUse = await chrome.storage.sync.getBytesInUse();
    const MAX_BYTES = 102400; // 100KB

    if (bytesInUse > MAX_BYTES * 0.9) {
      bus.emit('toast:show', {
        message: '存储空间不足 90%',
        type: 'warning',
      });
    }
  }
}
```

---

## 五、UI 组件设计

### 5.1 组件基类

```javascript
/**
 * 组件基类
 * 提供统一的组件生命周期和状态管理
 *
 * @example
 * class MyComponent extends Component {
 *   render() { return document.createElement('div'); }
 * }
 */
class Component {
  /**
   * @param {object} props
   */
  constructor(props = {}) {
    /** @type {object} */
    this.props = props;
    /** @type {object} */
    this.state = {};
    /** @type {Element|null} */
    this.el = null;
    /** @type {Array<Function>} */
    this._cleanup = [];
  }

  /**
   * 渲染方法（子类必须实现）
   * @returns {Element}
   */
  render() {
    throw new Error('render() must be implemented');
  }

  /**
   * 挂载组件
   * @param {Element} parent
   * @returns {Component}
   */
  mount(parent) {
    this.el = this.render();
    parent.appendChild(this.el);
    this.onMounted();
    return this;
  }

  /**
   * 卸载组件
   */
  unmount() {
    this.onUnmounted();
    this._cleanup.forEach(fn => fn());
    this.el?.remove();
    this.el = null;
  }

  /**
   * 更新状态
   * @param {object} newState
   * @param {boolean} shouldRender 是否重新渲染
   */
  setState(newState, shouldRender = true) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...newState };

    if (shouldRender && this.el) {
      this.onUpdate(oldState);
    }
  }

  /**
   * 添加清理函数
   * @param {Function} fn
   */
  addCleanup(fn) {
    this._cleanup.push(fn);
  }

  /**
   * 生命周期：挂载后
   */
  onMounted() {}

  /**
   * 生命周期：卸载后
   */
  onUnmounted() {}

  /**
   * 生命周期：状态更新后
   * @param {object} oldState
   */
  onUpdate(oldState) {}
}
```

### 5.2 NoteList 组件

```javascript
/**
 * 笔记列表组件
 *
 * @example
 * const list = new NoteList({ store, bus });
 * list.mount(container);
 */
class NoteList extends Component {
  constructor(props) {
    super(props);

    /** @type {Note[]} */
    this.state.notes = [];

    /** @type {string|null} */
    this.state.activeId = null;

    /** @type {string} */
    this.state.searchQuery = '';

    this._setupListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'note-list';

    // 空状态
    if (this.state.notes.length === 0) {
      container.innerHTML = this._renderEmpty();
      return container;
    }

    // 渲染列表项
    this.state.notes.forEach(note => {
      const item = this._renderItem(note);
      container.appendChild(item);
    });

    return container;
  }

  /**
   * 渲染单个笔记项
   * @private
   */
  _renderItem(note) {
    const isActive = note.id === this.state.activeId;

    const item = document.createElement('div');
    item.className = `note-item${isActive ? ' active' : ''}`;
    item.dataset.id = note.id;

    // 标题
    const title = document.createElement('div');
    title.className = 'note-item-title';
    title.textContent = note.title || '未命名笔记';

    // 预览
    const preview = document.createElement('div');
    preview.className = 'note-item-preview';
    preview.textContent = this._getPreview(note.content);

    // 删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'note-item-delete';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.ariaLabel = '删除笔记';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      this._handleDelete(note);
    };

    item.onclick = () => this._handleSelect(note);

    item.append(title, preview, deleteBtn);
    return item;
  }

  /**
   * 渲染空状态
   * @private
   */
  _renderEmpty() {
    return `
      <div class="note-list-empty">
        <div class="empty-icon">📝</div>
        <div class="empty-title">还没有笔记</div>
        <div class="empty-desc">点击下方按钮创建</div>
      </div>
    `;
  }

  /**
   * 获取内容预览
   * @private
   */
  _getPreview(content) {
    if (!content) return '无内容';
    // 移除换行，取前 30 字
    return content.replace(/\n/g, ' ').slice(0, 30) || '无内容';
  }

  /**
   * 设置事件监听
   * @private
   */
  _setupListeners() {
    // 监听数据变化
    this.addCleanup(
      this.props.store.on('change', () => {
        this._refreshNotes();
      })
    );

    // 监听笔记选择变化
    this.addCleanup(
      this.props.bus.on('note:select', (id) => {
        this.setState({ activeId: id });
        this._updateActiveItem();
      })
    );

    // 监听搜索
    this.addCleanup(
      this.props.bus.on('search:change', (query) => {
        this.setState({ searchQuery: query });
        this._refreshNotes();
      })
    );
  }

  /**
   * 刷新笔记列表
   * @private
   */
  _refreshNotes() {
    const notes = this.props.store.searchNotes(this.state.searchQuery);
    this.setState({ notes }, false);
    this._updateContainer();
  }

  /**
   * 更新容器内容
   * @private
   */
  _updateContainer() {
    if (!this.el) return;
    const newEl = this.render();
    this.el.replaceWith(newEl);
    this.el = newEl;
  }

  /**
   * 更新选中状态
   * @private
   */
  _updateActiveItem() {
    if (!this.el) return;

    const items = this.el.querySelectorAll('.note-item');
    items.forEach(item => {
      const isActive = item.dataset.id === this.state.activeId;
      item.classList.toggle('active', isActive);
    });
  }

  /**
   * 处理选择
   * @private
   */
  _handleSelect(note) {
    this.props.bus.emit('note:select', note.id);
  }

  /**
   * 处理删除
   * @private
   */
  _handleDelete(note) {
    this.props.bus.emit('note:delete-request', note);
  }
}
```

### 5.3 NoteEditor 组件

```javascript
/**
 * 笔记编辑器组件
 */
class NoteEditor extends Component {
  constructor(props) {
    super(props);

    /** @type {Note|null} */
    this.state.note = null;

    /** @type {AutoSaver} */
    this.saver = new AutoSaver(props.store, 1000);

    this._setupListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'note-editor-section';

    if (!this.state.note) {
      container.innerHTML = this._renderEmpty();
      return container;
    }

    // 头部
    const header = document.createElement('div');
    header.className = 'note-header';

    const titleInput = document.createElement('input');
    titleInput.className = 'note-title-input';
    titleInput.value = this.state.note.title;
    titleInput.placeholder = '未命名笔记';
    titleInput.oninput = (e) => {
      this.saver.save(this.state.note.id, { title: e.target.value });
    };

    const meta = document.createElement('div');
    meta.className = 'note-meta';

    const timeDisplay = document.createElement('span');
    timeDisplay.className = 'note-time';
    timeDisplay.textContent = this._formatTime(this.state.note.updatedAt);

    const saveStatus = document.createElement('span');
    saveStatus.className = 'note-save-status';
    saveStatus.innerHTML = '✓ 已保存';

    meta.append(timeDisplay, saveStatus);
    header.append(titleInput, meta);

    // 编辑器
    const editor = document.createElement('div');
    editor.className = 'note-editor';

    const textarea = document.createElement('textarea');
    textarea.className = 'note-content-textarea';
    textarea.value = this.state.note.content;
    textarea.placeholder = '开始输入...';
    textarea.oninput = (e) => {
      this.saver.save(this.state.note.id, { content: e.target.value });
    };

    editor.appendChild(textarea);
    container.append(header, editor);

    // 保存引用
    this._titleInput = titleInput;
    this._textarea = textarea;
    this._saveStatus = saveStatus;

    // 监听保存完成
    this.addCleanup(
      this.props.bus.on('save:complete', () => {
        this._showSaveStatus();
      })
    );

    return container;
  }

  /**
   * 渲染空状态
   * @private
   */
  _renderEmpty() {
    return `
      <div class="editor-empty">
        <div class="empty-icon">📄</div>
        <div class="empty-title">选择或创建一条笔记</div>
        <div class="empty-desc">开始编辑你的第一条笔记</div>
      </div>
    `;
  }

  /**
   * 设置事件监听
   * @private
   */
  _setupListeners() {
    this.addCleanup(
      this.props.bus.on('note:select', (id) => {
        const note = this.props.store.state.notes.find(n => n.id === id);
        this.setState({ note: note || null });
        this._updateContainer();
      })
    );

    this.addCleanup(
      this.props.bus.on('note:updated', (note) => {
        if (note.id === this.state.note?.id) {
          this.setState({ note }, false);
          this._updateTimeDisplay();
        }
      })
    );
  }

  /**
   * 显示保存状态
   * @private
   */
  _showSaveStatus() {
    if (!this._saveStatus) return;
    this._saveStatus.classList.add('show');
    setTimeout(() => {
      this._saveStatus.classList.remove('show');
    }, 2000);
  }

  /**
   * 更新容器
   * @private
   */
  _updateContainer() {
    if (!this.el) return;
    const newEl = this.render();
    this.el.replaceWith(newEl);
    this.el = newEl;
  }

  /**
   * 更新时间显示
   * @private
   */
  _updateTimeDisplay() {
    if (!this.state.note) return;
    const timeDisplay = this.el?.querySelector('.note-time');
    if (timeDisplay) {
      timeDisplay.textContent = this._formatTime(this.state.note.updatedAt);
    }
  }

  /**
   * 格式化时间
   * @private
   */
  _formatTime(timestamp) {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} 小时前`;

    const days = Math.floor(hours / 24);
    return `${days} 天前`;
  }
}
```

### 5.4 SearchBar 组件

```javascript
/**
 * 搜索栏组件
 */
class SearchBar extends Component {
  constructor(props) {
    super(props);

    /** @type {string} */
    this.state.value = '';
  }

  render() {
    const container = document.createElement('div');
    container.className = 'search-bar';

    const wrapper = document.createElement('div');
    wrapper.className = 'search-input-wrapper';

    // 图标
    const icon = document.createElement('span');
    icon.className = 'search-icon';
    icon.textContent = '🔍';

    // 输入框
    const input = document.createElement('input');
    input.className = 'search-input';
    input.value = this.state.value;
    input.placeholder = '搜索...';
    input.oninput = (e) => {
      this.setState({ value: e.target.value });
      this.props.bus.emit('search:change', e.target.value);
      this._updateClearButton();
    };

    // 清除按钮
    const clear = document.createElement('button');
    clear.className = 'search-clear';
    clear.innerHTML = '&times;';
    clear.onclick = () => {
      input.value = '';
      this.setState({ value: '' });
      this.props.bus.emit('search:change', '');
      this._updateClearButton();
    };

    wrapper.append(icon, input, clear);
    container.appendChild(wrapper);

    this._input = input;
    this._wrapper = wrapper;

    this._updateClearButton();

    return container;
  }

  /**
   * 更新清除按钮显示
   * @private
   */
  _updateClearButton() {
    if (!this._wrapper) return;
    this._wrapper.classList.toggle('has-value', this.state.value.length > 0);
  }

  /**
   * 聚焦输入框
   */
  focus() {
    this._input?.focus();
  }
}
```

### 5.5 ConfirmDialog 组件

```javascript
/**
 * 确认弹窗组件
 * 带倒计时防误操作
 *
 * @example
 * const dialog = new ConfirmDialog({
 *   title: '确认删除',
 *   message: '确定删除「xxx」吗？',
 *   onConfirm: () => console.log('confirmed'),
 * });
 * dialog.mount(document.body);
 */
class ConfirmDialog extends Component {
  constructor(props) {
    super(props);

    /** @type {number} */
    this.countdown = 3;
    /** @type {NodeJS.Timeout|null} */
    this.timer = null;
  }

  render() {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';

    // 点击遮罩关闭
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        this.close();
      }
    };

    const dialog = document.createElement('div');
    dialog.className = 'dialog';
    dialog.onclick = (e) => e.stopPropagation();

    // 图标
    const icon = document.createElement('div');
    icon.className = 'dialog-icon';
    icon.textContent = '🗑️';

    // 标题
    const title = document.createElement('div');
    title.className = 'dialog-title';
    title.textContent = this.props.title || '确认操作';

    // 消息
    const message = document.createElement('div');
    message.className = 'dialog-message';
    message.innerHTML = this.props.message || '';

    // 按钮
    const buttons = document.createElement('div');
    buttons.className = 'dialog-buttons';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'dialog-btn dialog-btn-cancel';
    cancelBtn.textContent = '取消';
    cancelBtn.onclick = () => this.close();

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'dialog-btn dialog-btn-confirm';
    confirmBtn.textContent = `确认 (${this.countdown})`;
    confirmBtn.disabled = true;

    buttons.append(cancelBtn, confirmBtn);
    dialog.append(icon, title, message, buttons);
    overlay.appendChild(dialog);

    this._confirmBtn = confirmBtn;
    this._startCountdown();

    // 取消时清理
    this.addCleanup(() => {
      if (this.timer) clearTimeout(this.timer);
    });

    return overlay;
  }

  /**
   * 开始倒计时
   * @private
   */
  _startCountdown() {
    let count = this.countdown;

    this.timer = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(this.timer);
        this._confirmBtn.disabled = false;
        this._confirmBtn.textContent = '确认';
        this._confirmBtn.onclick = () => {
          this.props.onConfirm?.();
          this.close();
        };
      } else {
        this._confirmBtn.textContent = `确认 (${count})`;
      }
    }, 1000);
  }

  /**
   * 关闭弹窗
   */
  close() {
    if (this.timer) clearInterval(this.timer);
    this.unmount();
  }
}
```

---

## 六、样式系统

### 6.1 CSS Variables（与 UI 设计稿一致）

```css
:root {
  /* 色彩 */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-bg-hover: #e8e8e8;
  --color-bg-active: #f0f7ff;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-tertiary: #999999;
  --color-text-placeholder: #bbbbbb;
  --color-border: #e5e5e5;
  --color-border-focus: #0066cc;
  --color-primary: #0066cc;
  --color-primary-light: #f0f7ff;
  --color-error: #ff4444;
  --color-success: #22c55e;
  --color-overlay: rgba(0, 0, 0, 0.4);

  /* 字体 */
  --font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI",
                      "Helvetica Neue", Arial, sans-serif;
  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-base: 13px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 20px;

  /* 间距 */
  --spacing-xs: 3px;
  --spacing-sm: 6px;
  --spacing-md: 12px;
  --spacing-lg: 18px;
  --spacing-xl: 24px;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;

  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* 动画 */
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}
```

### 6.2 全局重置样式

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  line-height: 1.5;
}

input, textarea {
  font: inherit;
  color: inherit;
  border: none;
  outline: none;
  background: transparent;
}

textarea {
  resize: none;
}

button {
  font: inherit;
  color: inherit;
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
}

:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}
```

### 6.3 主布局样式

```css
/* 侧边栏容器 */
.slidenote-sidebar {
  width: 480px;
  height: 100vh;
  display: flex;
  background: var(--color-bg-primary);
}

/* 左侧笔记列表 */
.note-list-section {
  width: 180px;
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

/* 右侧内容区 */
.note-content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-primary);
}
```

---

## 七、Chrome 扩展配置

### 7.1 manifest.json

```json
{
  "manifest_version": 3,
  "name": "LiteNote",
  "version": "0.0.1",
  "description": "轻量级侧边栏笔记插件，跨设备同步",
  "permissions": [
    "storage"
  ],
  "action": {
    "default_title": "打开 LiteNote",
    "default_icon": {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png"
    }
  },
  "side_panel": {
    "default_path": "sidepanel.html"
  },
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  "chrome_url_overrides": {}
}
```

### 7.2 权限说明

| 权限 | 用途 | 必要性 |
|------|------|--------|
| `storage` | 数据存储和同步 | 必需 |

### 7.3 Side Panel API

Chrome Side Panel 是 Chrome 114+ 的新特性，提供常驻侧边栏：

```javascript
// 打开侧边栏
chrome.sidePanel.open();

// 设置侧边栏选项
chrome.sidePanel.setOptions({
  enabled: true,
  path: 'sidepanel.html'
});
```

---

## 八、构建配置

### 8.1 Vite 配置

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // 构建配置
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'src/sidepanel/index.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },

  // 开发服务器（用于 HTML 原型调试）
  server: {
    port: 3000,
    open: '/src/sidepanel/index.html',
  },

  // 预览服务器
  preview: {
    port: 3000,
  },
});
```

### 8.2 package.json

```json
{
  "name": "liternote",
  "version": "0.0.1",
  "description": "LiteNote - 轻量级侧边栏笔记插件",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint src"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "eslint": "^8.55.0"
  }
}
```

### 8.3 tsconfig.json（用于类型检查）

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowJs": true,
    "checkJs": true,
    "noEmit": true,
    "strict": false,
    "skipLibCheck": true,
    "types": ["chrome"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 九、应用入口

### 9.1 app.js - 应用初始化

```javascript
/**
 * LiteNote 应用入口
 *
 * @module app
 */

import { Store } from './core/Store.js';
import { EventBus } from './core/EventBus.js';
import { SyncManager } from './core/SyncManager.js';
import { NoteList } from './components/NoteList.js';
import { NoteEditor } from './components/NoteEditor.js';
import { SearchBar } from './components/SearchBar.js';

/**
 * 应用类
 */
class App {
  constructor() {
    /** @type {Store} */
    this.store = new Store();

    /** @type {EventBus} */
    this.bus = new EventBus();

    /** @type {SyncManager} */
    this.syncManager = null;

    /** @type {Object<string, Component>} */
    this.components = {};
  }

  /**
   * 初始化应用
   */
  async init() {
    // 等待存储就绪
    await this.store.init();

    // 初始化同步管理
    this.syncManager = new SyncManager(this.store);

    // 挂载组件
    this._mountComponents();

    // 设置全局事件监听
    this._setupGlobalListeners();

    console.log('LiteNote initialized');
  }

  /**
   * 挂载组件
   * @private
   */
  _mountComponents() {
    const container = document.querySelector('#app');

    // 搜索栏
    const searchSection = document.createElement('div');
    searchSection.className = 'note-list-section';
    this.components.searchBar = new SearchBar({ store: this.store, bus: this.bus });
    this.components.searchBar.mount(searchSection);

    // 笔记列表
    this.components.noteList = new NoteList({ store: this.store, bus: this.bus });
    this.components.noteList.mount(searchSection);

    // 笔记编辑器
    const contentSection = document.createElement('div');
    contentSection.className = 'note-content-section';
    this.components.noteEditor = new NoteEditor({ store: this.store, bus: this.bus });
    this.components.noteEditor.mount(contentSection);

    container.append(searchSection, contentSection);
  }

  /**
   * 设置全局事件监听
   * @private
   */
  _setupGlobalListeners() {
    // 新建笔记
    this.bus.on('note:create', async () => {
      const note = await this.store.createNote();
      this.bus.emit('note:select', note.id);
    });

    // 删除笔记请求
    this.bus.on('note:delete-request', (note) => {
      this._showDeleteConfirm(note);
    });
  }

  /**
   * 显示删除确认
   * @private
   */
  _showDeleteConfirm(note) {
    const { ConfirmDialog } = this.components;
    if (ConfirmDialog) {
      ConfirmDialog.unmount();
    }

    this.components.ConfirmDialog = new ConfirmDialog({
      title: '确认删除',
      message: `确定删除「${note.title}」吗？<br>此操作无法撤销。`,
      onConfirm: async () => {
        await this.store.deleteNote(note.id);
      },
    });

    this.components.ConfirmDialog.mount(document.body);
  }
}

// 创建并初始化应用
const app = new App();
app.init();

// 导出用于调试
window.__LITENOTE__ = { app, Store, EventBus };
```

---

## 十、开发流程

### 10.1 开发调试流程

```
┌─────────────────────────────────────────────────────────┐
│  1. 修改代码                                              │
│     ↓                                                    │
│  2. Vite 自动 HMR 更新（仅样式/HTML）                      │
│     ↓                                                    │
│  3. 刷新 Chrome 扩展（chrome://extensions/ 重新加载）       │
│     ↓                                                    │
│  4. 测试功能                                             │
└─────────────────────────────────────────────────────────┘
```

### 10.2 调试技巧

1. **侧边栏调试**: 右键侧边栏 → "检查"
2. **后台脚本调试**: chrome://extensions/ → "service worker"
3. **存储查看**: chrome://sync/ 或 DevTools → Application → Storage
4. **日志输出**: Console 面板查看 `console.log`

### 10.3 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 构建
npm run build
```

---

## 十一、发布流程

### 11.1 版本管理

```bash
# 更新版本号
npm version patch   # 0.0.1 -> 0.0.2
npm version minor   # 0.0.1 -> 0.1.0
npm version major   # 0.0.1 -> 1.0.0
```

### 11.2 构建打包

```bash
# 构建
npm run build

# 打包
cd dist
zip -r ../liternote-v0.0.1.zip .
```

### 11.3 Chrome Web Store 发布

1. 准备素材
   - 图标: 128x128
   - 截图: 1280x800 或 640x400
   - 宣传图: 440x280（可选）

2. 填写商店信息
   - 名称: LiteNote
   - 描述: 简短描述
   - 详细说明
   - 分类: 生产力工具

3. 上传并提交审核

---

## 十二、附录

### 12.1 Chrome Storage 限制

| 限制项 | 限制值 | 说明 |
|--------|--------|------|
| 单条数据 | 8KB | 单个 key 的 value 大小 |
| 总容量 | 100KB | storage.sync 总限制 |
| 读取频率 | 无限制 | - |
| 写入频率 | 约 1 次/秒 | 过于频繁会被限流 |
| 同步间隔 | ~10 秒 | 跨设备同步延迟 |

### 12.2 相关链接

- [Chrome Extension API](https://developer.chrome.com/docs/extensions/reference/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)

### 12.3 变更记录

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2025-01-11 | v0.0.1 | 初始版本，根据 UI 设计稿更新 |
