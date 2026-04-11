import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { deleteUploadedFile } from '@/lib/upload';
import { apiResponse, apiError } from '@/lib/utils';

export async function POST(request) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);

  const { ids } = await request.json();
  if (!Array.isArray(ids) || ids.length === 0) return apiError('No IDs provided');

  const items = await prisma.media.findMany({ where: { id: { in: ids } } });

  for (const item of items) {
    await deleteUploadedFile(item.filename);
  }

  await prisma.media.deleteMany({ where: { id: { in: ids } } });

  return apiResponse({ deleted: ids.length });
}
