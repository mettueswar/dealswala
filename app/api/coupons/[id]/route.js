import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { apiResponse, apiError } from '@/lib/utils';

const include = { store: { select: { id: true, name: true, slug: true, logo: true } }, category: { select: { id: true, name: true, slug: true } } };

export async function GET(_, { params }) {
  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({ where: { id }, include });
  if (!coupon) return apiError('Not found', 404);
  return apiResponse(coupon);
}

export async function PUT(request, { params }) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);
  const { id } = await params;
  try {
    const body = await request.json();
    const { title, description, code, discount, affLink, storeId, categoryId, expiresAt, verified, featured, active } = body;
    const coupon = await prisma.coupon.update({
      where: { id },
      data: { title, description, code: code?.toUpperCase(), discount, affLink, storeId, categoryId: categoryId || null, expiresAt: expiresAt ? new Date(expiresAt) : null, verified: !!verified, featured: !!featured, active: active !== false },
      include,
    });
    return apiResponse(coupon);
  } catch (err) {
    return apiError(err.message, 500);
  }
}

export async function DELETE(request, { params }) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);
  const { id } = await params;
  await prisma.coupon.delete({ where: { id } });
  return apiResponse({ ok: true });
}
