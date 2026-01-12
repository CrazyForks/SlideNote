/**
 * i18n - 国际化工具函数
 * 封装 chrome.i18n API
 */

/**
 * 获取翻译文本
 * @param {string} key - 消息 key
 * @param {string[]} placeholders - 占位符值
 * @returns {string} 翻译后的文本
 *
 * @example
 * t('newNote') → '新建笔记'
 * t('deleteConfirm', ['笔记1']) → '确定删除「笔记1」吗？'
 */
export function t(key, placeholders = []) {
  return chrome.i18n.getMessage(key, placeholders);
}

/**
 * 获取当前 UI 语言
 * @returns {string} 语言代码，如 'zh-CN', 'en-US'
 */
export function getUILanguage() {
  return chrome.i18n.getUILanguage();
}

/**
 * 判断是否为中文环境
 * @returns {boolean}
 */
export function isChinese() {
  const lang = getUILanguage();
  return lang.startsWith('zh');
}

/**
 * 获取消息对象（用于多个占位符）
 * @param {string} key - 消息 key
 * @returns {Object} 包含 message 和 placeholders 的对象
 */
export function getMessage(key) {
  return {
    key,
    translate: (...placeholders) => t(key, placeholders)
  };
}

// 导出常用消息的快捷方法
export const i18n = {
  newNote: () => t('newNote'),
  newNoteShort: () => t('newNoteShort'),
  searchPlaceholder: () => t('searchPlaceholder'),
  closeSearch: () => t('closeSearch'),
  unnamedNote: () => t('unnamedNote'),
  startTyping: () => t('startTyping'),
  saved: () => t('saved'),
  emptyTitle: () => t('emptyTitle'),
  emptyDesc: () => t('emptyDesc'),
  cancel: () => t('cancel'),
  confirm: () => t('confirm'),
  moveToTop: () => t('moveToTop'),
  moveUp: () => t('moveUp'),
  moveDown: () => t('moveDown'),
  moveToBottom: () => t('moveToBottom'),
  delete: () => t('delete'),
  tagline: () => t('tagline'),
  lastEdited: () => t('lastEdited'),
};
