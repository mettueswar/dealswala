import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#f7f6f3] border-t border-[#e5e2db] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-display font-semibold text-lg text-[#1a1916] mb-3">
              Deal<span className="text-[#d4720a]">Wala</span>
            </div>
            <p className="text-sm text-[#6b6860] leading-relaxed">
              India's trusted source for verified coupons and deals from 500+ top brands.
            </p>
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-[#1a1916] mb-3">Explore</h3>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/deals', 'Today\'s Deals'], ['/coupons', 'Coupons'], ['/stores', 'All Stores']].map(([href, label]) => (
                <li key={href}><Link href={href} className="text-sm text-[#6b6860] hover:text-[#d4720a] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-[#1a1916] mb-3">Popular Stores</h3>
            <ul className="space-y-2">
              {[['amazon', 'Amazon India'], ['flipkart', 'Flipkart'], ['myntra', 'Myntra'], ['zomato', 'Zomato']].map(([slug, name]) => (
                <li key={slug}><Link href={`/stores/${slug}`} className="text-sm text-[#6b6860] hover:text-[#d4720a] transition-colors">{name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-[#1a1916] mb-3">Categories</h3>
            <ul className="space-y-2">
              {[['electronics', 'Electronics'], ['fashion', 'Fashion'], ['food', 'Food & Dining'], ['travel', 'Travel']].map(([slug, name]) => (
                <li key={slug}><Link href={`/categories/${slug}`} className="text-sm text-[#6b6860] hover:text-[#d4720a] transition-colors">{name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-[#e5e2db] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#9e9b96]">© {new Date().getFullYear()} DealWala. All rights reserved.</p>
          <p className="text-xs text-[#9e9b96]">We may earn commission from qualifying purchases.</p>
        </div>
      </div>
    </footer>
  );
}
