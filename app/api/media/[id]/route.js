import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { deleteUploadedFile } from '@/lib/upload';
import { apiResponse, apiError } from '@/lib/utils';

export async function DELETE(request, { params }) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);

  const { id } = await params;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return apiError('Not found', 404);

  // Delete from disk
  await deleteUploadedFile(media.filename);

  // Delete from DB
  await prisma.media.delete({ where: { id } });

  return apiResponse({ ok: true });
}
