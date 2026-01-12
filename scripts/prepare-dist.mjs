import { copyFileSync, mkdirSync, readFileSync, writeFileSync, rmSync, renameSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = join(__dirname, '..', 'dist');

// 清理并重新整理 dist 目录
try {
  // 1. 复制 manifest.json
  copyFileSync(join(__dirname, '..', 'manifest.json'), join(distDir, 'manifest.json'));
  console.log('✓ Copied manifest.json');

  // 2. 复制 background.js
  copyFileSync(join(__dirname, '..', 'src', 'background.js'), join(distDir, 'background.js'));
  console.log('✓ Copied background.js');

  // 3. 创建 icons 目录并复制图标
  mkdirSync(join(distDir, 'icons'), { recursive: true });
  const srcIconsDir = join(__dirname, '..', 'public', 'icons');
  const files = readdirSync(srcIconsDir);
  for (const file of files) {
    if (!file.endsWith('.svg')) continue; // 只复制 SVG 文件
    copyFileSync(join(srcIconsDir, file), join(distDir, 'icons', file));
  }
  console.log(`✓ Copied ${files.filter(f => f.endsWith('.svg')).length} icon files`);

  // 3.5. 复制 _locales 目录（国际化文件）
  const srcLocalesDir = join(__dirname, '..', '_locales');
  const dstLocalesDir = join(distDir, '_locales');
  const copyLocaleDir = (src, dst) => {
    mkdirSync(dst, { recursive: true });
    const entries = readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const dstPath = join(dst, entry.name);
      if (entry.isDirectory()) {
        copyLocaleDir(srcPath, dstPath);
      } else {
        copyFileSync(srcPath, dstPath);
      }
    }
  };
  copyLocaleDir(srcLocalesDir, dstLocalesDir);
  console.log('✓ Copied _locales directory');

  // 4. 重命名 JS 和 CSS 文件
  renameSync(join(distDir, 'index.js'), join(distDir, 'sidepanel.js'));
  renameSync(join(distDir, 'index.css'), join(distDir, 'sidepanel.css'));
  console.log('✓ Renamed index.js -> sidepanel.js, index.css -> sidepanel.css');

  // 5. 创建 sidepanel.html
  const srcHtmlPath = join(distDir, 'src', 'sidepanel', 'index.html');
  const destHtmlPath = join(distDir, 'sidepanel.html');

  let htmlContent = readFileSync(srcHtmlPath, 'utf-8');
  // 替换 Vite 生成的资源引用为相对路径
  htmlContent = htmlContent.replace(/src="\/index\.js"/g, 'src="./sidepanel.js"');
  htmlContent = htmlContent.replace(/href="\/index\.css"/g, 'href="./sidepanel.css"');

  writeFileSync(destHtmlPath, htmlContent);
  console.log('✓ Created sidepanel.html');

  // 6. 删除 src 目录
  rmSync(join(distDir, 'src'), { recursive: true, force: true });

  // 7. 删除 .DS_Store
  try {
    rmSync(join(distDir, '.DS_Store'), { force: true });
  } catch (e) {
    // ignore
  }

  console.log('\n✓ Build complete! Load "dist" in Chrome to test.');
  console.log('\n  Directory structure:');
  console.log('  dist/');
  console.log('  ├── manifest.json');
  console.log('  ├── background.js');
  console.log('  ├── sidepanel.html');
  console.log('  ├── sidepanel.js');
  console.log('  ├── sidepanel.css');
  console.log('  ├── icons/');
  console.log('  └── _locales/');
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
