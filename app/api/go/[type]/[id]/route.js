import { prisma } from '@/lib/prisma';
import { clickLimiter } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { type, id } = await params;
  const ip = getClientIp(request);

  let affLink = null;

  try {
    if (type === 'deal') {
      const deal = await prisma.deal.findUnique({ where: { id } });
      if (deal?.active) {
        affLink = deal.affLink;
        const limit = clickLimiter(`deal:${id}:${ip}`);
        if (limit.ok) await prisma.deal.update({ where: { id }, data: { clicks: { increment: 1 } } });
      }
    } else if (type === 'coupon') {
      const coupon = await prisma.coupon.findUnique({ where: { id } });
      if (coupon?.active) {
        affLink = coupon.affLink;
        const limit = clickLimiter(`coupon:${id}:${ip}`);
        if (limit.ok) await prisma.coupon.update({ where: { id }, data: { clicks: { increment: 1 } } });
      }
    }
  } catch {}

  if (!affLink) return NextResponse.redirect(new URL('/', request.url));

  return NextResponse.redirect(affLink, {
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  });
}
