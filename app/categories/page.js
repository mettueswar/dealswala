import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { buildMeta } from '@/lib/seo';

export const metadata = buildMeta({ title: 'All Categories', path: '/categories' });

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { deals: true, coupons: true, stores: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display font-semibold text-2xl text-[#1a1916] mb-6">All Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map(c => (
          <Link key={c.id} href={`/categories/${c.slug}`}
            className="bg-white border border-[#e5e2db] rounded-2xl p-5 hover:border-[#d4720a] group transition-all">
            <div className="text-3xl mb-3">{c.icon}</div>
            <h2 className="font-display font-semibold text-base text-[#1a1916] mb-1 group-hover:text-[#d4720a] transition-colors">{c.name}</h2>
            <p className="text-xs text-[#9e9b96]">{c._count.deals + c._count.coupons} offers · {c._count.stores} stores</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
