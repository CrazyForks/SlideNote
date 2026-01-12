/**
 * SearchBar - 搜索栏组件（包含新建按钮）
 */

export class SearchBar {
  constructor(props = {}) {
    this.props = props;
    this.state = { value: '' };
    this.el = null;
    this._input = null;
    this._wrapper = null;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'search-bar';

    // 搜索栏头部（搜索框 + 新建按钮）
    const header = document.createElement('div');
    header.className = 'search-header';

    const wrapper = document.createElement('div');
    wrapper.className = 'search-input-wrapper';

    // 搜索图标
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
      this.props.bus?.emit('search:change', e.target.value);
    };

    wrapper.append(icon, input);

    // 新建按钮（独立按钮，在搜索框外）
    const newNoteBtn = document.createElement('button');
    newNoteBtn.className = 'btn-new-note';
    newNoteBtn.title = '新建笔记';
    newNoteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    `;
    newNoteBtn.onclick = () => {
      this.props.bus?.emit('note:create');
    };

    header.append(wrapper, newNoteBtn);
    container.appendChild(header);

    this._input = input;
    this._wrapper = wrapper;

    return container;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  /**
   * 聚焦输入框
   */
  focus() {
    this._input?.focus();
  }
}
