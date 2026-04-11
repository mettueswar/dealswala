import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import OfferCard from '@/components/cards/OfferCard';
import StoreCard from '@/components/cards/StoreCard';

const offerInclude = { store: { select: { id: true, name: true, slug: true, logo: true } } };

export default async function HomePage() {
  const [featuredDeals, featuredCoupons, featuredStores, categories] = await Promise.all([
    prisma.deal.findMany({ where: { active: true, featured: true }, include: offerInclude, orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.coupon.findMany({ where: { active: true, featured: true }, include: offerInclude, orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.store.findMany({ where: { active: true, featured: true }, include: { _count: { select: { deals: true, coupons: true } } }, orderBy: { name: 'asc' }, take: 8 }),
    prisma.category.findMany({ orderBy: { order: 'asc' }, include: { _count: { select: { deals: true, coupons: true } } } }),
  ]);

  const totalDeals = await prisma.deal.count({ where: { active: true } });
  const totalCoupons = await prisma.coupon.count({ where: { active: true } });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="bg-[#f7f6f3] border border-[#e5e2db] rounded-2xl px-8 py-10 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-[#1a1916] leading-tight mb-3">
            Best Coupons &amp; Deals<br />in India Today
          </h1>
          <p className="text-[#6b6860] text-base leading-relaxed mb-6 max-w-md">
            Save more on every purchase. Verified coupons from 500+ top Indian brands — updated daily.
          </p>
          <div className="flex gap-6">
            <Stat num={`${totalDeals + totalCoupons}+`} lbl="Active Offers" />
            <Stat num="98%" lbl="Verified" />
            <Stat num="500+" lbl="Stores" />
          </div>
        </div>
        <Link href="/coupons" className="shrink-0 bg-[#d4720a] hover:bg-[#b85e08] text-white font-display font-semibold text-sm rounded-xl px-6 py-3 transition-colors">
          Browse All Offers →
        </Link>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <SectionHeader title="Shop by Category" href="/categories" />
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <Link key={c.id} href={`/categories/${c.slug}`}
              className="flex items-center gap-1.5 bg-white border border-[#e5e2db] hover:border-[#d4720a] hover:text-[#d4720a] hover:bg-[#fdf0e0] text-[#6b6860] font-display font-medium text-sm px-3.5 py-1.5 rounded-full transition-all">
              <span>{c.icon}</span> {c.name}
              <span className="text-xs text-[#9e9b96] ml-1">{(c._count.deals + c._count.coupons)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Stores */}
      <section className="mb-8">
        <SectionHeader title="Popular Stores" href="/stores" />
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {featuredStores.map(s => <StoreCard key={s.id} store={s} />)}
        </div>
      </section>

      {/* Featured Deals */}
      {featuredDeals.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="Today's Best Deals" href="/deals" />
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featuredDeals.map(d => <OfferCard key={d.id} item={d} type="deal" />)}
          </div>
        </section>
      )}

      {/* Featured Coupons */}
      {featuredCoupons.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="Top Coupon Codes" href="/coupons" />
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featuredCoupons.map(c => <OfferCard key={c.id} item={c} type="coupon" />)}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ num, lbl }) {
  return (
    <div>
      <p className="font-display font-semibold text-xl text-[#d4720a]">{num}</p>
      <p className="text-xs text-[#9e9b96]">{lbl}</p>
    </div>
  );
}

function SectionHeader({ title, href }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display font-semibold text-lg text-[#1a1916]">{title}</h2>
      {href && <Link href={href} className="font-display font-medium text-sm text-[#d4720a] hover:underline">View all →</Link>}
    </div>
  );
}
