import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { apiResponse, apiError } from '@/lib/utils';

export async function PUT(request, { params }) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);
  const { id } = await params;
  try {
    const { name, slug, icon, description, order } = await request.json();
    const cat = await prisma.category.update({ where: { id }, data: { name, slug, icon, description, order: order || 0 } });
    return apiResponse(cat);
  } catch (err) { return apiError(err.message, 500); }
}

export async function DELETE(request, { params }) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);
  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return apiResponse({ ok: true });
}
