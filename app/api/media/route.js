import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { saveUploadedFile } from '@/lib/upload';
import { apiResponse, apiError } from '@/lib/utils';

export async function GET(request) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);

  const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
  return apiResponse(media);
}

export async function POST(request) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') return apiError('No file provided');

    const saved = await saveUploadedFile(file);

    const media = await prisma.media.create({
      data: {
        filename: saved.filename,
        originalName: saved.originalName,
        mimeType: saved.mimeType,
        size: saved.size,
        width: saved.width,
        height: saved.height,
        url: saved.url,
        uploadedById: session.id,
      },
    });

    return apiResponse(media, 201);
  } catch (err) {
    return apiError(err.message || 'Upload failed', 400);
  }
}

// // Disable Next.js body parsing so we can handle raw FormData
// export const config = { api: { bodyParser: false } };
