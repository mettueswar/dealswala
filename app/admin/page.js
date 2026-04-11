import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import StatsCards from '@/components/admin/StatsCards';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await requireAdmin();
  if (!session) redirect('/login?next=/admin');

  const [deals, coupons, stores, users, topDeals, topCoupons, recentDeals, recentCoupons] = await Promise.all([
    prisma.deal.count(),
    prisma.coupon.count(),
    prisma.store.count({ where: { active: true } }),
    prisma.user.count(),
    prisma.deal.findMany({ orderBy: { clicks: 'desc' }, take: 5, select: { id: true, title: true, clicks: true, discount: true, store: { select: { name: true, logo: true } } } }),
    prisma.coupon.findMany({ orderBy: { clicks: 'desc' }, take: 5, select: { id: true, title: true, clicks: true, code: true, discount: true, store: { select: { name: true, logo: true } } } }),
    prisma.deal.findMany({ orderBy: { createdAt: 'desc' }, take: 4, include: { store: { select: { name: true, logo: true } } } }),
    prisma.coupon.findMany({ orderBy: { createdAt: 'desc' }, take: 4, include: { store: { select: { name: true, logo: true } } } }),
  ]);

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display font-semibold text-2xl text-[#1a1916]">Dashboard</h1>
        <p className="text-sm text-[#9e9b96]">Welcome back, {session.name}</p>
      </div>

      <div className="mb-6">
        <StatsCards stats={{ deals, coupons, stores, users }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top Deals by Clicks */}
        <div className="bg-white border border-[#e5e2db] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-sm text-[#1a1916]">Top Deals by Clicks</h2>
            <Link href="/admin/deals" className="text-xs text-[#d4720a] font-display font-medium hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {topDeals.map(d => (
              <div key={d.id} className="flex items-center gap-3">
                <span className="text-lg shrink-0">{d.store.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-display font-medium text-[#1a1916] truncate">{d.title}</p>
                  <p className="text-[11px] text-[#9e9b96]">{d.store.name} · {d.discount}</p>
                </div>
                <span className="text-xs font-display font-semibold text-[#d4720a] shrink-0">{d.clicks} clicks</span>
              </div>
            ))}
            {topDeals.length === 0 && <p className="text-xs text-[#9e9b96] text-center py-4">No data yet</p>}
          </div>
        </div>

        {/* Top Coupons by Clicks */}
        <div className="bg-white border border-[#e5e2db] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-sm text-[#1a1916]">Top Coupons by Clicks</h2>
            <Link href="/admin/coupons" className="text-xs text-[#d4720a] font-display font-medium hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {topCoupons.map(c => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="text-lg shrink-0">{c.store.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-display font-medium text-[#1a1916] truncate">{c.title}</p>
                  <p className="text-[11px] text-[#9e9b96]">{c.store.name} · <span className="font-mono">{c.code}</span></p>
                </div>
                <span className="text-xs font-display font-semibold text-[#d4720a] shrink-0">{c.clicks} clicks</span>
              </div>
            ))}
            {topCoupons.length === 0 && <p className="text-xs text-[#9e9b96] text-center py-4">No data yet</p>}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-[#e5e2db] rounded-xl p-4">
        <h2 className="font-display font-semibold text-sm text-[#1a1916] mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {[
            ['/admin/deals', '+ New Deal', 'bg-green-50 text-green-700 border-green-200'],
            ['/admin/coupons', '+ New Coupon', 'bg-orange-50 text-orange-700 border-orange-200'],
            ['/admin/stores', '+ New Store', 'bg-blue-50 text-blue-700 border-blue-200'],
            ['/admin/categories', '+ New Category', 'bg-purple-50 text-purple-700 border-purple-200'],
          ].map(([href, label, cls]) => (
            <Link key={href} href={href}
              className={`font-display font-semibold text-xs px-3 py-2 rounded-lg border transition-colors hover:opacity-80 ${cls}`}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
