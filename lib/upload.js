import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || './uploads');
const MAX_BYTES = (parseInt(process.env.MAX_FILE_SIZE_MB || '5') * 1024 * 1024);
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

// Ensure upload dir exists
export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function saveUploadedFile(formDataFile) {
  await ensureUploadDir();

  const mimeType = formDataFile.type;
  if (!ALLOWED_TYPES.includes(mimeType)) {
    throw new Error(`File type "${mimeType}" not allowed. Use JPEG, PNG, WebP, GIF or SVG.`);
  }

  const arrayBuffer = await formDataFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.byteLength > MAX_BYTES) {
    throw new Error(`File too large. Max size is ${process.env.MAX_FILE_SIZE_MB || 5}MB.`);
  }

  // Generate unique filename preserving extension
  const originalExt = path.extname(formDataFile.name).toLowerCase() || '.jpg';
  const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(originalExt) ? originalExt : '.jpg';
  const filename = `${uuidv4()}${safeExt}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  let width = null, height = null;

  // Process images with sharp (skip SVG)
  if (mimeType !== 'image/svg+xml') {
    try {
      const img = sharp(buffer);
      const meta = await img.metadata();
      width = meta.width;
      height = meta.height;

      // Resize if very large (max 2000px on longest side), keep aspect ratio
      let processedBuffer = buffer;
      if (width > 2000 || height > 2000) {
        processedBuffer = await img
          .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
          .toBuffer();
        const resizedMeta = await sharp(processedBuffer).metadata();
        width = resizedMeta.width;
        height = resizedMeta.height;
      }
      await fs.writeFile(filepath, processedBuffer);
    } catch {
      // If sharp fails, just save raw
      await fs.writeFile(filepath, buffer);
    }
  } else {
    await fs.writeFile(filepath, buffer);
  }

  const stats = await fs.stat(filepath);

  return {
    filename,
    originalName: formDataFile.name,
    mimeType,
    size: stats.size,
    width,
    height,
    url: `/api/media/serve/${filename}`,
  };
}

export async function deleteUploadedFile(filename) {
  // Sanitize: no path traversal
  const safe = path.basename(filename);
  const filepath = path.join(UPLOAD_DIR, safe);
  try {
    await fs.unlink(filepath);
  } catch {
    // File may already be gone
  }
}

export async function getFilePath(filename) {
  const safe = path.basename(filename);
  return path.join(UPLOAD_DIR, safe);
}
