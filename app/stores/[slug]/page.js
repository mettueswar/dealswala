import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import OfferCard from '@/components/cards/OfferCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmptyState from '@/components/ui/EmptyState';
import { buildStoreMeta } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return {};
  return buildStoreMeta(store);
}

export async function generateStaticParams() {
  const stores = await prisma.store.findMany({ select: { slug: true } });
  return stores.map(s => ({ slug: s.slug }));
}

export default async function StorePage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const tab = sp.tab || 'all';

  const store = await prisma.store.findUnique({
    where: { slug, active: true },
    include: { _count: { select: { deals: true, coupons: true } } },
  });
  if (!store) notFound();

  const offerInclude = { store: { select: { id: true, name: true, slug: true, logo: true, logoUrl: true } } };

  const [deals, coupons] = await Promise.all([
    prisma.deal.findMany({ where: { storeId: store.id, active: true }, include: offerInclude, orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }] }),
    prisma.coupon.findMany({ where: { storeId: store.id, active: true }, include: offerInclude, orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }] }),
  ]);

  const shown = tab === 'deals' ? deals : tab === 'coupons' ? coupons : [...deals, ...coupons];
  const tabs = [
    { key: 'all', label: `All (${deals.length + coupons.length})` },
    { key: 'coupons', label: `Coupons (${coupons.length})` },
    { key: 'deals', label: `Deals (${deals.length})` },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Stores', href: '/stores' }, { label: store.name }]} />

      {/* Store Hero */}
      <div className="bg-[#f7f6f3] border border-[#e5e2db] rounded-2xl p-6 mb-6 flex items-start gap-5">
        <div className="w-20 h-20 bg-white border border-[#e5e2db] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
          {store.logoUrl
            ? <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain p-2" />
            : <span className="text-4xl">{store.logo}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-semibold text-2xl text-[#1a1916] mb-1">{store.name}</h1>
          <p className="text-sm text-[#6b6860] mb-3 leading-relaxed">{store.shortDesc}</p>
          <div className="flex gap-4 text-sm flex-wrap">
            <span className="text-[#9e9b96]"><strong className="text-[#d4720a]">{store._count.deals}</strong> deals</span>
            <span className="text-[#9e9b96]"><strong className="text-[#d4720a]">{store._count.coupons}</strong> coupons</span>
            {store.website && (
              <a href={store.website} target="_blank" rel="noopener noreferrer nofollow"
                className="text-[#d4720a] hover:underline font-display font-medium">
                Visit Store ↗
              </a>
            )}
          </div>
        </div>
      </div>



      {/* Tabs */}
      <div className="border-b border-[#e5e2db] mb-6 flex gap-1">
        {tabs.map(t => (
          <a key={t.key} href={`?tab=${t.key}`}
            className={`font-display font-medium text-sm px-4 py-2.5 border-b-2 -mb-px transition-colors
              ${tab === t.key ? 'border-[#d4720a] text-[#d4720a]' : 'border-transparent text-[#6b6860] hover:text-[#1a1916]'}`}>
            {t.label}
          </a>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState icon="🎟️" title="No offers found" desc="No active offers for this filter." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {shown.map(item => {
            const type = 'code' in item ? 'coupon' : 'deal';
            return <OfferCard key={item.id} item={item} type={type} />;
          })}
        </div>
      )}


            {/* Long Description */}
      {store.longDesc && (
        <div className="bg-white border border-[#e5e2db] rounded-2xl p-6 mt-6">
          <div className="prose-content" dangerouslySetInnerHTML={{ __html: store.longDesc }} />
        </div>
      )}
    </div>
  );
}
