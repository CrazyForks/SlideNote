/**
 * SlideNote 应用入口
 *
 * @module app
 */

import { Store, SyncManager } from './core/Store.js';
import { bus } from './core/EventBus.js';
import { Toolbar } from './components/Toolbar.js';
import { NoteList } from './components/NoteList.js';
import { NoteEditor } from './components/NoteEditor.js';
import { ConfirmDialog } from './components/ConfirmDialog.js';
import { t } from './utils/i18n.js';

/**
 * 应用类
 */
class App {
  constructor() {
    this.store = null;
    this.syncManager = null;
    this.components = {};
    this.dialog = null;
    this._listSection = null;  // 笔记列表区域引用
  }

  /**
   * 初始化应用
   */
  async init() {
    // 创建存储实例
    this.store = new Store();
    await this.store.init();

    // 初始化同步管理
    this.syncManager = new SyncManager(this.store);
    this.store.setSyncManager(this.syncManager);

    // 挂载组件
    this._mountComponents();

    // 设置全局事件监听
    this._setupGlobalListeners();

    // 恢复上次选中的笔记
    this._restoreActiveNote();

    console.log('SlideNote initialized');
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

    // 根据初始状态渲染展开或折叠状态
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
    this.components.toolbar = new Toolbar({ bus });
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
    const topActions = this._renderTopActions();
    listSection.appendChild(topActions);

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
    newBtn.title = t('newNote') || '新建笔记';
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
    expandBtn.title = t('expandSidebar') || '展开侧边栏';
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

    // 作者链接（根据语言环境选择不同链接）
    const authorDiv = document.createElement('div');
    authorDiv.className = 'footer-author';
    const author = t('author');
    const developedByText = t('developedBy', [author]);
    // 中文用 blog，英文用 dev.to
    const uiLang = chrome.i18n.getUILanguage();
    const authorUrl = uiLang.startsWith('zh') ? 'https://blog.gudong.site/' : 'https://dev.to/gudong';
    authorDiv.innerHTML = developedByText.replace(
      author,
      `<a href="${authorUrl}" target="_blank" class="author-link">${author}</a>`
    );

    // 社交链接
    const socialDiv = document.createElement('div');
    socialDiv.className = 'footer-social';

    // GitHub
    const githubLink = this._createSocialLink('https://github.com/maoruibin/SlideNote', t('viewSource'), '/icons/social-github.svg');

    // Twitter/X
    const twitterLink = this._createSocialLink('https://x.com/dxgudong', 'X', '/icons/social-x.svg');

    // 即刻
    const jikeLink = this._createSocialLink('https://web.okjike.com/u/3f000c6d-bd82-4695-a404-f184652e622e', '即刻', '/icons/social-jike.svg');

    // 小红书
    const xhsLink = this._createSocialLink('https://www.xiaohongshu.com/user/profile/6690863b000000001e00e6a4', '小红书', '/icons/social-xiaohongshu.svg');

    // 微信公众号 (带二维码)
    const wechatLink = this._createWeChatLink('https://gudong.s3.bitiful.net/asset/gongzhonghao.jpg');

    socialDiv.append(githubLink, twitterLink, jikeLink, xhsLink, wechatLink);

    const taglineDiv = document.createElement('div');
    taglineDiv.className = 'footer-tagline';
    taglineDiv.textContent = t('tagline');

    // 意见反馈链接
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'footer-feedback';
    const feedbackUrl = 'https://my.feishu.cn/share/base/form/shrcnnfhgGcaqzU3lUfrDxamVZc';
    feedbackDiv.innerHTML = `
      <a href="${feedbackUrl}" target="_blank" class="feedback-link" title="${t('feedbackTitle')}">
        <span class="feedback-icon">💬</span>
        <span class="feedback-text">${t('feedback')}</span>
      </a>
    `;

    appFooter.append(authorDiv, socialDiv, taglineDiv, feedbackDiv);
    footer.appendChild(appFooter);

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
      bus.emit('note:select', result.id);
      // 延迟触发编辑模式（等待渲染完成）
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
   * 显示删除确认
   * @private
   */
  _showDeleteConfirm(note) {
    // 关闭之前的弹窗
    if (this.dialog) {
      this.dialog.close();
    }

    const noteTitle = note.title || t('unnamedNote');
    this.dialog = new ConfirmDialog({
      title: t('confirmDelete'),
      message: t('deleteConfirm', [noteTitle]).replace('\\n', '<br>'),
      onConfirm: async () => {
        await this.store.deleteNote(note.id);
        this.dialog = null;
      },
    });

    this.dialog.show();
  }

  /**
   * 创建社交链接
   * @private
   */
  _createSocialLink(href, tooltip, iconPath) {
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.className = 'footer-social-link';
    link.setAttribute('data-tooltip', tooltip);

    // 创建图片元素加载 SVG
    const img = document.createElement('img');
    img.src = iconPath;
    img.alt = tooltip;
    img.className = 'footer-social-icon';
    link.appendChild(img);

    return link;
  }

  /**
   * 创建微信链接（带二维码）
   * @private
   */
  _createWeChatLink(qrCodeUrl) {
    const link = document.createElement('span');
    link.className = 'footer-social-link footer-wechat-link';

    // 创建图片元素加载 SVG 图标
    const img = document.createElement('img');
    img.src = '/icons/social-wechat.svg';
    img.alt = '微信公众号';
    img.className = 'footer-social-icon';
    link.appendChild(img);

    // 创建二维码弹层
    const qrPopup = document.createElement('div');
    qrPopup.className = 'footer-qr-popup';

    const qrImg = document.createElement('img');
    qrImg.src = qrCodeUrl;
    qrImg.alt = '公众号二维码';
    qrImg.className = 'footer-qr-img';
    qrPopup.appendChild(qrImg);

    // 添加文案
    const qrText = document.createElement('div');
    qrText.className = 'footer-qr-text';
    qrText.textContent = '扫码关注 公众号 咕咚同学';
    qrPopup.appendChild(qrText);

    link.appendChild(qrPopup);

    return link;
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
   * 展开侧边栏（在需要时调用）
   */
  async expandSidebar() {
    if (!this.store.isSidebarCollapsed()) return;

    this._listSection.classList.remove('collapsed');
    this._renderExpandedState(this._listSection);
    await this.store.setSidebarCollapsed(false);
  }

  /**
   * 恢复上次选中的笔记
   * @private
   */
  _restoreActiveNote() {
    const activeNoteId = this.store.state.activeNoteId;
    if (activeNoteId) {
      // 检查笔记是否还存在
      const noteExists = this.store.state.notes.find(n => n.id === activeNoteId);
      if (noteExists) {
        // 触发 note:select 事件，让 NoteEditor 加载内容
        bus.emit('note:select', activeNoteId);
      } else {
        // 笔记不存在了，清除 activeNoteId
        this.store.state.activeNoteId = null;
      }
    }
  }
}

// 创建并初始化应用
const app = new App();
app.init();

// 导出用于调试
window.__SLIDENOTE__ = { app, Store, bus };
