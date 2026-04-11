import Link from 'next/link';

export default function StoreCard({ store }) {
  const total = (store._count?.deals || 0) + (store._count?.coupons || 0);
  return (
    <Link href={`/stores/${store.slug}`}
      className="bg-white border border-[#e5e2db] rounded-2xl p-4 text-center hover:border-[#d4720a] transition-all duration-150 block group">
      <div className="w-12 h-12 bg-[#f7f6f3] rounded-xl flex items-center justify-center text-2xl mx-auto mb-2 overflow-hidden group-hover:bg-[#fdf0e0] transition-colors">
        {store.logoUrl
          ? <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
          : store.logo}
      </div>
      <p className="font-display font-semibold text-sm text-[#1a1916] mb-0.5 truncate">{store.name}</p>
      <p className="text-xs text-[#9e9b96]">{total} offer{total !== 1 ? 's' : ''}</p>
    </Link>
  );
}
