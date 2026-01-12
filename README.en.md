<p align="center">
  <img src="https://gudong.s3.bitiful.net/weimd/1768183653015_image.png" width="600" alt="SlideNote">
</p>

<h1 align="center">SlideNote</h1>

<p align="center">
  <strong>Slide notes, always by your side</strong>
</p>

<p align="center">
  Chrome Sidebar Note Extension | Cross-device Sync | Minimal Design
</p>

<p align="center">
  <a href="https://github.com/maoruibin/SlideNote"><img alt="GitHub version" src="https://img.shields.io/badge/version-0.0.1-blue"></a>
  <a href="https://github.com/maoruibin/SlideNote/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-green"></a>
</p>

---

## Features

- **Sidebar Display** — Fixed in browser sidebar, always accessible
- **Auto Save** — Automatically saves 1 second after you stop typing
- **Cross-device Sync** — Cloud sync via Chrome Storage API
- **Search Filter** — Real-time search through titles and content
- **Note Ordering** — Right-click menu to reorder notes
- **Ultra Lightweight** — No framework dependencies, bundle size only 20KB

---

## Use Cases

| Scenario | Description |
|----------|-------------|
| Multi-device Workers | Take notes at work, continue at home |
| Developers | Store API keys, server addresses, config info |
| Content Creators | Manage multiple account passwords, copy templates, asset links |
| Quick Notes | Fast capture of ideas, to-dos, clipboard content |

---

## Installation

### Method 1: Install from Source

```bash
# Clone repository
git clone https://github.com/maoruibin/SlideNote.git
cd SlideNote

# Install dependencies
npm install

# Build
npm run build
```

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `dist` folder in the project root

### Method 2: Chrome Web Store (Coming Soon)

Search "SlideNote" for one-click installation

---

## Usage

1. Click the SlideNote icon in Chrome toolbar
2. The sidebar opens, ready to use
3. Click "New Note" to create your first note
4. Click on a note to select and start editing
5. Right-click a note to reorder or delete
6. Auto-saves 1 second after you stop typing

---

## Tech Stack

```
Vanilla JS (ES6+)  →  No framework, ultra lightweight
Vite               →  Fast build
Chrome Storage     →  Free cloud sync
CSS Variables      →  Design system
```

**Why no framework?**

| Reason | Description |
|--------|-------------|
| Performance | Load time < 100ms, no 100KB+ framework overhead |
| Simplicity | CRUD doesn't need complex state management |
| Stability | No framework upgrade risks, code works long-term |

---

## Project Structure

```
slidenote/
├── src/sidepanel/
│   ├── core/           # Data layer (Store, EventBus, SyncManager)
│   ├── components/     # UI components
│   └── utils/          # Utility functions
├── docs/               # Design documents
└── public/icons/       # Icon resources
```

---

## Design Philosophy

```
Restrained colors  →  Monochrome main tone, doesn't distract
Clear hierarchy   →  List vs content, clear at a glance
Comfortable spacing →  Breathing room, not cramped
Consistent border radius →  Gentle, not sharp
```

---

## Roadmap

### v0.0.1 (Current)
- [x] Basic CRUD
- [x] Auto save
- [x] Cross-device sync
- [x] Search filter
- [x] Note ordering (right-click menu)
- [x] UI optimization (adaptive width, remove focus borders)

### v0.0.2 (Planned)
- [ ] Note grouping/tags
- [ ] Data export (JSON/Markdown)
- [ ] Keyboard shortcuts

---

## Support

If this project helps you, consider buying me a coffee ☕️

<table align="center">
  <tr>
    <td align="center">
      <img src="https://doc.gudong.site/assets/img/wechat-donate.5e615ccb.jpg" width="180" alt="WeChat Pay"/>
    </td>
    <td align="center">
      <img src="https://doc.gudong.site/assets/img/alipay-donate.7ec06101.jpg" width="180" alt="Alipay"/>
    </td>
  </tr>
</table>

---

## More Projects

Check out more of my projects and articles: **[doc.gudong.site](https://doc.gudong.site/)**

---

## License

[MIT License](LICENSE)

---

## Author

**Gudong** | Blog: https://blog.gudong.site/

> **Slide notes, always by your side**

---

If this project helps you, please give it a ⭐ Star!
