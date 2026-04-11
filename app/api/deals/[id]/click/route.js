import { prisma } from '@/lib/prisma';
import { clickLimiter } from '@/lib/rateLimit';
import { getClientIp, apiResponse } from '@/lib/utils';

export async function POST(request, { params }) {
  const ip = getClientIp(request);
  const { id } = await params;
  const limit = clickLimiter(`deal:${id}:${ip}`);
  if (!limit.ok) return apiResponse({ ok: true }); // silently ignore
  await prisma.deal.update({ where: { id }, data: { clicks: { increment: 1 } } }).catch(() => {});
  return apiResponse({ ok: true });
}
