import { prisma } from '@/lib/prisma';
import OfferCard from '@/components/cards/OfferCard';
import EmptyState from '@/components/ui/EmptyState';
import { buildMeta } from '@/lib/seo';

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const q = sp.q || '';
  return buildMeta({
    title: q ? `"${q}" — Search Results` : 'Search',
    path: `/search?q=${encodeURIComponent(q)}`,
    noindex: true,
  });
}

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = (sp.q || '').trim();

  let deals = [], coupons = [];

  if (q.length >= 2) {
    const offerInclude = {
      store: { select: { id: true, name: true, slug: true, logo: true, logoUrl: true } },
    };
    const textSearch = [
      { title:       { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
    [deals, coupons] = await Promise.all([
      prisma.deal.findMany({
        where: { active: true, OR: textSearch },
        include: offerInclude,
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
      prisma.coupon.findMany({
        where: {
          active: true,
          OR: [...textSearch, { code: { contains: q, mode: 'insensitive' } }],
        },
        include: offerInclude,
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
    ]);
  }

  const total = deals.length + coupons.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display font-semibold text-2xl text-[#1a1916] mb-1">
          {q ? `Results for "${q}"` : 'Search Offers'}
        </h1>
        {q && <p className="text-sm text-[#6b6860]">{total} result{total !== 1 ? 's' : ''} found</p>}
      </div>

      {!q && (
        <EmptyState icon="🔍" title="Search for coupons & deals"
          desc='Try "Amazon", "fashion", "FLAT200" or any store name.' />
      )}
      {q && total === 0 && (
        <EmptyState icon="😕" title="No results found"
          desc={`No offers matched "${q}". Try a different keyword or browse by category.`} />
      )}

      {deals.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display font-semibold text-base text-[#1a1916] mb-4">Deals ({deals.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {deals.map(d => <OfferCard key={d.id} item={d} type="deal" />)}
          </div>
        </section>
      )}
      {coupons.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display font-semibold text-base text-[#1a1916] mb-4">Coupons ({coupons.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coupons.map(c => <OfferCard key={c.id} item={c} type="coupon" />)}
          </div>
        </section>
      )}
    </div>
  );
}
