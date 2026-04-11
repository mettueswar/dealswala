import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { apiResponse, apiError, sanitize } from '@/lib/utils';

const include = {
  category: { select: { id: true, name: true, slug: true } },
  _count: { select: { deals: true, coupons: true } },
};

export async function GET(_, { params }) {
  const { id } = await params;
  const store = await prisma.store.findUnique({ where: { id }, include });
  if (!store) return apiError('Not found', 404);
  return apiResponse(store);
}

export async function PUT(request, { params }) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, slug, logo, logoUrl, website, affLink, shortDesc, longDesc, categoryId, featured, active } = body;
    const store = await prisma.store.update({
      where: { id },
      data: {
        name, slug,
        logo: logo || '🛒',
        logoUrl: logoUrl || null,
        website: website || null,
        affLink, shortDesc,
        longDesc: sanitize(longDesc || ''),
        categoryId: categoryId || null,
        featured: !!featured,
        active: active !== false,
      },
      include,
    });
    return apiResponse(store);
  } catch (err) {
    return apiError(err.message, 500);
  }
}

export async function DELETE(request, { params }) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);
  const { id } = await params;
  await prisma.store.delete({ where: { id } });
  return apiResponse({ ok: true });
}
