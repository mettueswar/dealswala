import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { apiResponse, apiError } from '@/lib/utils';

const include = { store: { select: { id: true, name: true, slug: true, logo: true, logoUrl: true } }, category: { select: { id: true, name: true, slug: true } } };

export async function GET(_, { params }) {
  const { id } = await params;
  const deal = await prisma.deal.findUnique({ where: { id }, include });
  if (!deal) return apiError('Not found', 404);
  return apiResponse(deal);
}

export async function PUT(request, { params }) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);
  const { id } = await params;
  try {
    const body = await request.json();
    const { title, description, discount, affLink, imageUrl, storeId, categoryId, expiresAt, verified, featured, active } = body;
    const deal = await prisma.deal.update({
      where: { id },
      data: {
        title, description, discount, affLink,
        imageUrl: imageUrl || null,
        storeId,
        categoryId: categoryId || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        verified: !!verified,
        featured: !!featured,
        active: active !== false,
      },
      include,
    });
    return apiResponse(deal);
  } catch (err) {
    return apiError(err.message, 500);
  }
}

export async function DELETE(request, { params }) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);
  const { id } = await params;
  await prisma.deal.delete({ where: { id } });
  return apiResponse({ ok: true });
}