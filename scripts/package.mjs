/**
 * 打包脚本 - 创建发布用的 zip 包
 * 输出到 versions/ 目录
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');
const versionsDir = join(rootDir, 'versions');

// 确保版本目录存在
if (!existsSync(versionsDir)) {
  mkdirSync(versionsDir, { recursive: true });
}

// 读取 manifest.json 获取版本号
const manifestPath = join(rootDir, 'dist', 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
const version = manifest.version;

console.log(`\n📦 Packaging SlideNote v${version}\n`);

// 创建 zip 包
const zipFileName = `SlideNote-v${version}.zip`;
const zipPath = join(versionsDir, zipFileName);

console.log(`Creating ${zipFileName}...`);

try {
  execSync(`cd dist && zip -r ../versions/${zipFileName} .`, {
    stdio: 'inherit',
  });

  // 获取文件大小
  const stats = existsSync(zipPath) ? statSync(zipPath) : null;
  const sizeKB = stats ? (stats.size / 1024).toFixed(1) : 'N/A';

  console.log(`\n✅ Package created: versions/${zipFileName} (${sizeKB} KB)`);
  console.log(`\n📤 Upload this file to Chrome Web Store:\n`);
  console.log(`   ${zipPath}\n`);
} catch (err) {
  console.error('❌ Package failed:', err.message);
  process.exit(1);
}
