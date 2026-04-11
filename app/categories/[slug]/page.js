import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import OfferCard from '@/components/cards/OfferCard';
import StoreCard from '@/components/cards/StoreCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmptyState from '@/components/ui/EmptyState';
import { buildMeta } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) return {};
  return buildMeta({ title: `${cat.name} Coupons & Deals`, description: `Best ${cat.name} coupons, promo codes and deals from top Indian stores.`, path: `/categories/${slug}` });
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const offerInclude = { store: { select: { id: true, name: true, slug: true, logo: true } } };

  const [deals, coupons, stores] = await Promise.all([
    prisma.deal.findMany({ where: { categoryId: category.id, active: true }, include: offerInclude, orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }] }),
    prisma.coupon.findMany({ where: { categoryId: category.id, active: true }, include: offerInclude, orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }] }),
    prisma.store.findMany({ where: { categoryId: category.id, active: true }, include: { _count: { select: { deals: true, coupons: true } } }, take: 8 }),
  ]);

  const offers = [...deals.map(d => ({ ...d, _type: 'deal' })), ...coupons.map(c => ({ ...c, _type: 'coupon' }))];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Categories', href: '/categories' }, { label: category.name }]} />

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{category.icon}</span>
        <div>
          <h1 className="font-display font-semibold text-2xl text-[#1a1916]">{category.name} Offers</h1>
          <p className="text-sm text-[#6b6860]">{offers.length} active offers</p>
        </div>
      </div>

      {stores.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display font-semibold text-base text-[#1a1916] mb-3">Top {category.name} Stores</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {stores.map(s => <StoreCard key={s.id} store={s} />)}
          </div>
        </section>
      )}

      {offers.length === 0 ? (
        <EmptyState icon={category.icon} title="No offers yet" desc="New offers for this category are coming soon." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {offers.map(item => <OfferCard key={item.id} item={item} type={item._type} />)}
        </div>
      )}
    </div>
  );
}
