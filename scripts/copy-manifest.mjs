import { copyFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const src = join(__dirname, '..', 'manifest.json');
const distDir = join(__dirname, '..', 'dist');

try {
  mkdirSync(distDir, { recursive: true });
  copyFileSync(src, join(distDir, 'manifest.json'));
  console.log('✓ Copied manifest.json to dist/');
} catch (err) {
  console.error('Error copying manifest.json:', err);
  process.exit(1);
}
