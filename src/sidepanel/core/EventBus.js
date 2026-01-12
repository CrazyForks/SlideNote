/**
 * EventBus - 事件总线
 * 用于组件间通信
 *
 * @example
 * bus.on('note:select', (id) => console.log(id));
 * bus.emit('note:select', 'note_123');
 */

/**
 * 事件总线类
 */
export class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * 订阅事件
   * @param {string} event 事件名称
   * @param {Function} callback 回调函数
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
   * @param {string} event 事件名称
   * @param {*} data 传递的数据
   */
  emit(event, data) {
    const callbacks = this.events[event] || [];
    callbacks.forEach(cb => cb(data));
  }

  /**
   * 取消订阅
   * @param {string} event 事件名称
   * @param {Function} callback 回调函数
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

/**
 * 全局事件总线实例
 */
export const bus = new EventBus();
