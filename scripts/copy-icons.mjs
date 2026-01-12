import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const srcDir = join(__dirname, '..', 'public', 'icons');
const distDir = join(__dirname, '..', 'dist', 'icons');

try {
  mkdirSync(distDir, { recursive: true });

  const files = readdirSync(srcDir);
  for (const file of files) {
    copyFileSync(join(srcDir, file), join(distDir, file));
  }

  console.log(`✓ Copied ${files.length} icon files to dist/icons/`);
} catch (err) {
  console.error('Error copying icons:', err);
  process.exit(1);
}
