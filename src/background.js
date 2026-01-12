/**
 * Background Service Worker
 * 处理插件图标点击，打开侧边栏
 */

// 点击插件图标时打开侧边栏
chrome.action.onClicked.addListener(async (tab) => {
  // 打开当前标签页的侧边栏
  await chrome.sidePanel.open({ windowId: tab.windowId });
});

// 插件安装时启用侧边栏
chrome.runtime.onInstalled.addListener(async () => {
  // 设置侧边栏为默认打开
  await chrome.sidePanel.setOptions({
    enabled: true
  });
});
