import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { apiResponse, apiError } from '@/lib/utils';

export async function GET(request) {
  const session = getTokenFromRequest(request);
  if (!session || session.role !== 'admin') return apiError('Unauthorized', 401);

  const [deals, coupons, stores, users, topDeals, topCoupons] = await Promise.all([
    prisma.deal.count(),
    prisma.coupon.count(),
    prisma.store.count({ where: { active: true } }),
    prisma.user.count(),
    prisma.deal.findMany({ orderBy: { clicks: 'desc' }, take: 5, include: { store: { select: { name: true, logo: true } } } }),
    prisma.coupon.findMany({ orderBy: { clicks: 'desc' }, take: 5, include: { store: { select: { name: true, logo: true } } } }),
  ]);

  return apiResponse({ deals, coupons, stores, users, topDeals, topCoupons });
}
