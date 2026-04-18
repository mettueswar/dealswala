import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { apiResponse, apiError } from '@/lib/utils';

const include = {
  store: { select: { id: true, name: true, slug: true, logo: true, logoUrl: true } },
  category: { select: { id: true, name: true, slug: true } },
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '12'));
  const storeId    = searchParams.get('storeId');
  const categoryId = searchParams.get('categoryId');
  const featured   = searchParams.get('featured');
  const q          = searchParams.get('q');

  const where = { active: true };
  if (storeId)    where.storeId    = storeId;
  if (categoryId) where.categoryId = categoryId;
  if (featured === 'true') where.featured = true;
  if (q) {
    where.OR = [
      { title:       { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.deal.count({ where }),
    prisma.deal.findMany({
      where, include,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit, take: limit,
    }),
  ]);

  return apiResponse({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(request) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);

  try {
    const body = await request.json();
    const { title, description, discount, affLink, imageUrl, storeId, categoryId, expiresAt, verified, featured, active } = body;
    if (!title || !description || !discount || !affLink || !storeId)
      return apiError('Missing required fields');

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
    const deal = await prisma.deal.create({
      data: {
        title, slug, description, discount, affLink,
        imageUrl:    imageUrl    || null,
        storeId,
        categoryId:  categoryId  || null,
        expiresAt:   expiresAt   ? new Date(expiresAt) : null,
        verified:  !!verified,
        featured:  !!featured,
        active:    active !== false,
      },
      include,
    });
    return apiResponse(deal, 201);
  } catch (err) {
    return apiError(err.message || 'Server error', 500);
  }
}