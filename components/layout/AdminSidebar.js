'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const links = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/deals', label: 'Deals', icon: '🏷️' },
  { href: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
  { href: '/admin/stores', label: 'Stores', icon: '🏪' },
  { href: '/admin/categories', label: 'Categories', icon: '📂' },
  { href: '/admin/media', label: 'Media', icon: '🖼️' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-[#e5e2db] min-h-screen flex flex-col">
      <div className="p-4 border-b border-[#e5e2db]">
        <Link href="/" className="font-display font-semibold text-lg text-[#1a1916]">
          Deal<span className="text-[#d4720a]">Wala</span>
        </Link>
        <p className="text-xs text-[#9e9b96] mt-0.5 font-display">Admin Panel</p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {links.map(({ href, label, icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-sm font-display font-medium transition-all
                ${active ? 'bg-[#fdf0e0] text-[#d4720a]' : 'text-[#6b6860] hover:bg-[#f7f6f3] hover:text-[#1a1916]'}`}>
              <span className="text-base">{icon}</span> {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-[#e5e2db]">
        <button onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-sm font-display font-medium text-red-600 hover:bg-red-50 transition-all">
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
