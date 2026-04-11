import { prisma } from '@/lib/prisma';
import StoreCard from '@/components/cards/StoreCard';
import { buildMeta } from '@/lib/seo';

export const metadata = buildMeta({ title: 'All Stores — Coupons & Deals', description: 'Browse coupons and deals from 500+ top Indian online stores including Amazon, Flipkart, Myntra, Zomato and more.', path: '/stores' });

export default async function StoresPage() {
  const [stores, categories] = await Promise.all([
    prisma.store.findMany({
      where: { active: true },
      include: { _count: { select: { deals: true, coupons: true } }, category: true },
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    }),
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
  ]);

  // Group by category
  const grouped = {};
  const uncategorised = [];
  for (const store of stores) {
    if (store.category) {
      const key = store.category.name;
      if (!grouped[key]) grouped[key] = { cat: store.category, stores: [] };
      grouped[key].stores.push(store);
    } else {
      uncategorised.push(store);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display font-semibold text-2xl text-[#1a1916] mb-1">All Stores</h1>
        <p className="text-sm text-[#6b6860]">{stores.length} stores with active offers</p>
      </div>

      {Object.values(grouped).map(({ cat, stores: catStores }) => (
        <section key={cat.id} className="mb-8">
          <h2 className="font-display font-semibold text-base text-[#1a1916] mb-3 flex items-center gap-2">
            <span>{cat.icon}</span> {cat.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {catStores.map(s => <StoreCard key={s.id} store={s} />)}
          </div>
        </section>
      ))}

      {uncategorised.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display font-semibold text-base text-[#1a1916] mb-3">Other Stores</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {uncategorised.map(s => <StoreCard key={s.id} store={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}
