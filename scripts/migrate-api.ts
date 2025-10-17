import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const oldApiPath = path.join(__dirname, '../pages/api');
const newApiPath = path.join(__dirname, '../app/api');

function copyFilesRecursively(src: string, dest: string) {
  if (!fs.existsSync(src)) {
    console.error(`Source path does not exist: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyFilesRecursively(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied file: ${srcPath} -> ${destPath}`);
    }
  }
}

function migrateApi() {
  console.log('Starting API migration...');

  copyFilesRecursively(oldApiPath, newApiPath);

  console.log('API migration completed.');
}

migrateApi();