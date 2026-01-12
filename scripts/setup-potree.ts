import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';

const POTREE_VERSION = '1.8';
const POTREE_URL = `https://github.com/potree/potree/releases/download/${POTREE_VERSION}/potree.zip`;
const DOWNLOAD_PATH = path.join(process.cwd(), 'temp');
const PUBLIC_PATH = path.join(process.cwd(), 'public', 'potree');

async function downloadAndExtractPotree() {
  // Create directories if they don't exist
  if (!fs.existsSync(DOWNLOAD_PATH)) {
    fs.mkdirSync(DOWNLOAD_PATH);
  }
  
  if (!fs.existsSync(PUBLIC_PATH)) {
    fs.mkdirSync(PUBLIC_PATH, { recursive: true });
  }

  // Download Potree
  const zipPath = path.join(DOWNLOAD_PATH, 'potree.zip');
  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(zipPath);
    https.get(POTREE_URL, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(null);
      });
    }).on('error', reject);
  });

  // Extract and copy required files
  execSync(`unzip ${zipPath} -d ${DOWNLOAD_PATH}`);
  
  // Copy required files to public directory
  const filesToCopy = [
    'libs',
    'potree.js',
    'potree.css',
  ];

  filesToCopy.forEach(file => {
    const sourcePath = path.join(DOWNLOAD_PATH, 'potree', file);
    const destPath = path.join(PUBLIC_PATH, file);
    fs.cpSync(sourcePath, destPath, { recursive: true });
  });

  // Cleanup
  fs.rmSync(DOWNLOAD_PATH, { recursive: true });
}

downloadAndExtractPotree().catch(console.error); 