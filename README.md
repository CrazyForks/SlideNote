# SlideNote 侧边笔记

<p align="center">
  <img src="public/icons/icon-128.svg" width="80" alt="SlideNote Logo">
</p>

<p align="center">
  <strong>Slide notes, always by your side</strong><br>
  侧边笔记，常伴左右
</p>

<p align="center">
  Chrome 浏览器侧边栏笔记插件 | 跨设备自动同步 | 极简设计
</p>

<p align="center">
  <a href="https://github.com/maoruibin/SlideNote/releases"><img alt="GitHub release" src="https://img.shields.io/badge/version-0.0.1-blue"></a>
  <a href="https://github.com/maoruibin/SlideNote/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-green"></a>
</p>

---

## ✨ 特性

- **📌 侧边栏展示** — 固定在浏览器侧边，随时可用
- **💾 自动保存** — 停止输入 1 秒后自动保存
- **🔄 跨设备同步** — 基于 Chrome Storage API，自动云端同步
- **🔍 搜索过滤** — 实时搜索标题和内容
- **⚡️ 极致轻量** — 无框架依赖，打包仅 15KB

---

## 🎯 适用场景

```
┌─────────────────────────────────┐
│  🔍 搜索...                [+]  │
│                                 │
│  ● 常用账号                      │
│  ○ 云配置                        │
│  ○ API Keys                     │
│  ○ 服务器地址                    │
│                                 │
│  ─────────────────────          │
│  由咕咚同学开发                  │
│  [GitHub]   Slide notes, ...    │
└─────────────────────────────────┘
```

| 场景 | 说明 |
|------|------|
| 多设备工作者 | 公司电脑存密码，回家电脑能用 |
| 技术人员 | 存储 API Key、服务器地址、配置信息 |
| 运营/自媒体 | 管理多账号密码、文案模板、素材链接 |

---

## 📦 安装

### 方式一：从源码安装（开发者）

```bash
# 克隆仓库
git clone https://github.com/maoruibin/SlideNote.git
cd SlideNote

# 安装依赖
npm install

# 构建
npm run build
```

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择项目根目录的 `dist` 文件夹

### 方式二：Chrome 应用商店（即将上架）

搜索「SlideNote」一键安装

---

## 🚀 使用方法

1. 点击 Chrome 工具栏的 SlideNote 图标
2. 侧边栏展开，即可开始使用
3. 点击 `+` 按钮创建新笔记
4. 点击笔记项切换，开始编辑
5. 停止输入 1 秒后自动保存

---

## 🛠️ 技术栈

```
Vanilla JS (ES6+)  →  无框架，极致轻量
Vite               →  快速构建
Chrome Storage     →  免费云同步
CSS Variables      →  设计系统
```

**为什么不用框架？**

| 理由 | 说明 |
|------|------|
| 性能 | 加载时间 < 100ms，无 100KB+ 框架开销 |
| 简单 | CRUD 功能不需要复杂状态管理 |
| 稳定 | 无框架升级风险，代码长期可用 |

---

## 📁 项目结构

```
slidenote/
├── src/sidepanel/
│   ├── core/           # 数据层（Store, EventBus）
│   ├── components/     # UI 组件
│   └── utils/          # 工具函数
├── docs/               # 项目文档
└── public/icons/       # 图标资源
```

---

## 🎨 设计理念

```
克制的配色    → 单色主调，不抢注意力
清晰的层级    → 列表 vs 内容，一目了然
舒适的间距    → 呼吸感，不拥挤
统一的圆角    → 温和不尖锐
```

---

## 🗺️ 路线图

### v0.0.1（当前版本）
- [x] 基础 CRUD
- [x] 自动保存
- [x] 跨设备同步
- [x] 搜索过滤
- [x] 删除确认
- [x] 笔记排序（置顶、上移、下移）

### v0.0.2（计划中）
- [ ] 归档功能（解决 100KB 限制）
- [ ] 数据导出（JSON/Markdown）
- [ ] 容量监控警告

---

## 📮 关注作者

<p align="center">
  <img src="https://blog.gudong.site/assets/profile/gongzhonghao.jpg" width="200" alt="公众号二维码">
</p>

<p align="center">
  扫码关注公众号，获取开发日常和产品最新动态
</p>

---

## 📄 开源协议

[MIT License](LICENSE)

---

## 👨‍💻 作者

**咕咚同学** | 博客: https://blog.gudong.site/

> **Slide notes, always by your side**
>
> 侧边笔记，常伴左右

---

## ⭐ Star History

如果这个项目对你有帮助，请给个 Star 支持一下！

<a href="https://github.com/maoruibin/SlideNote">
  <img src="https://api.star-history.com/svg?repos=maoruibin/SlideNote&type=Date" alt="Star History Chart">
</a>
