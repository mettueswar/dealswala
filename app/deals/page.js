import { prisma } from '@/lib/prisma';
import OfferCard from '@/components/cards/OfferCard';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { buildMeta } from '@/lib/seo';

export const metadata = buildMeta({ title: 'Best Deals in India Today', description: 'Browse the latest verified deals and discount offers from top Indian brands. Save up to 80% on electronics, fashion, food and more.', path: '/deals' });

const PAGE_SIZE = 12;

export default async function DealsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || '1'));
  const categorySlug = sp.category;

  const category = categorySlug ? await prisma.category.findUnique({ where: { slug: categorySlug } }) : null;
  const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });

  const where = { active: true };
  if (category) where.categoryId = category.id;

  const [total, deals] = await Promise.all([
    prisma.deal.count({ where }),
    prisma.deal.findMany({
      where, include: { store: { select: { id: true, name: true, slug: true, logoUrl: true } } },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE,
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display font-semibold text-2xl text-[#1a1916] mb-1">Today's Best Deals</h1>
        <p className="text-sm text-[#6b6860]">{total} active deal{total !== 1 ? 's' : ''} — updated daily</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <FilterPill href="/deals" active={!categorySlug}>All</FilterPill>
        {categories.map(c => (
          <FilterPill key={c.id} href={`/deals?category=${c.slug}`} active={categorySlug === c.slug}>
            {c.icon} {c.name}
          </FilterPill>
        ))}
      </div>

      {deals.length === 0 ? (
        <EmptyState icon="🏷️" title="No deals yet" desc="Check back soon — new deals are added daily." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {deals.map(d => <OfferCard key={d.id} item={d} type="deal" />)}
          </div>
          <Pagination total={total} page={page} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}

function FilterPill({ href, active, children }) {
  return (
    <a href={href} className={`font-display font-medium text-sm px-3.5 py-1.5 rounded-full border transition-all
      ${active ? 'bg-[#fdf0e0] border-[#d4720a] text-[#d4720a]' : 'bg-white border-[#e5e2db] text-[#6b6860] hover:border-[#d4720a] hover:text-[#d4720a]'}`}>
      {children}
    </a>
  );
}
