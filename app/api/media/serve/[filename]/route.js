import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { getFilePath } from '@/lib/upload';
import path from 'path';

const MIME_MAP = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp',
  '.gif': 'image/gif', '.svg': 'image/svg+xml',
};

export async function GET(_, { params }) {
  const { filename } = await params;

  // Security: no path traversal, only basename
  const safe = path.basename(filename);
  const ext = path.extname(safe).toLowerCase();

  const mimeType = MIME_MAP[ext];
  if (!mimeType) return new NextResponse('Not found', { status: 404 });

  try {
    const filepath = await getFilePath(safe);
    const buffer = await fs.readFile(filepath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': buffer.byteLength.toString(),
        // Cache for 1 year (files are content-addressed by UUID filename)
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
