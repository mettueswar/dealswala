import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { apiResponse, apiError, sanitize } from '@/lib/utils';

const include = {
  category: { select: { id: true, name: true, slug: true } },
  _count: { select: { deals: true, coupons: true } },
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const featured   = searchParams.get('featured');
  const categoryId = searchParams.get('categoryId');
  const q          = searchParams.get('q');

  const where = { active: true };
  if (featured === 'true') where.featured = true;
  if (categoryId) where.categoryId = categoryId;
  if (q) where.name = { contains: q, mode: 'insensitive' };

  const stores = await prisma.store.findMany({
    where, include,
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  });
  return apiResponse(stores);
}

export async function POST(request) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);

  try {
    const body = await request.json();
    const { name, slug, logo, logoUrl, website, affLink, shortDesc, longDesc, categoryId, featured, active } = body;
    if (!name || !slug || !affLink || !shortDesc) return apiError('Missing required fields');

    const store = await prisma.store.create({
      data: {
        name, slug,
        logo:       logo    || '🛒',
        logoUrl:    logoUrl || null,
        website:    website || null,
        affLink,
        shortDesc,
        longDesc:   sanitize(longDesc || ''),
        categoryId: categoryId || null,
        featured:  !!featured,
        active:    active !== false,
      },
      include,
    });
    return apiResponse(store, 201);
  } catch (err) {
    if (err.code === 'P2002') return apiError('Slug already exists', 409);
    return apiError(err.message, 500);
  }
}
