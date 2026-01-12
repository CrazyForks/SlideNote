/**
 * ConfirmDialog - 确认弹窗组件
 * 带倒计时防误操作
 *
 * @example
 * const dialog = new ConfirmDialog({
 *   title: '确认删除',
 *   message: '确定删除「xxx」吗？',
 *   onConfirm: () => console.log('confirmed'),
 * });
 * dialog.show();
 */

export class ConfirmDialog {
  constructor(props = {}) {
    this.props = props;
    this.countdown = 3;
    this.timer = null;
    this.el = null;
    this._confirmBtn = null;
  }

  /**
   * 显示弹窗
   */
  show() {
    if (this.el) return;

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
    this.el = overlay;

    document.body.appendChild(overlay);
    this._startCountdown();
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
    if (this.el) {
      this.el.remove();
      this.el = null;
    }
  }
}
