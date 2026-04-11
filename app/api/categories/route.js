import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { apiResponse, apiError } from '@/lib/utils';

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { deals: true, coupons: true, stores: true } } },
  });
  return apiResponse(categories);
}

export async function POST(request) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);
  try {
    const { name, slug, icon, description, order } = await request.json();
    if (!name || !slug) return apiError('Name and slug required');
    const cat = await prisma.category.create({ data: { name, slug, icon: icon || '🏷️', description, order: order || 0 } });
    return apiResponse(cat, 201);
  } catch (err) {
    if (err.code === 'P2002') return apiError('Slug already exists', 409);
    return apiError(err.message, 500);
  }
}
