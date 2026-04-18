'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/modals/LoginModal';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <header className="bg-white border-b border-[#e5e2db] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-[60px] flex items-center gap-4">
          <Link href="/" className="font-display font-semibold text-xl text-[#1a1916] shrink-0">
            Cash<span className="text-[#d4720a]">Moj</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9b96] text-sm pointer-events-none">⌕</span>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search coupons, stores, deals…"
              className="w-full h-[38px] bg-[#f7f6f3] border border-[#e5e2db] rounded-[10px] pl-8 pr-4 text-sm text-[#1a1916] outline-none focus:border-[#d4720a] transition-colors" />
          </form>

          <nav className="hidden md:flex items-center gap-1 ml-auto">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/stores">Stores</NavLink>
            <NavLink href="/coupons">Coupons</NavLink>
            <NavLink href="/deals">Deals</NavLink>
            <NavLink href="/categories">Categories</NavLink>
          </nav>

          <div className="relative shrink-0" ref={menuRef}>
            {user ? (
              <>
                <button onClick={() => setMenuOpen(v => !v)}
                  className="flex items-center gap-2 bg-[#f7f6f3] border border-[#e5e2db] rounded-[10px] px-2 py-1.5 text-sm font-display font-medium text-[#1a1916] hover:border-[#d4720a] transition-colors">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-[#d4720a] text-white text-xs flex items-center justify-center font-semibold">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                  <span className="text-[#9e9b96]">▾</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-[#e5e2db] rounded-xl shadow-lg overflow-hidden w-44 animate-in z-50">
                    {user.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2.5 text-sm font-display font-medium text-[#1a1916] hover:bg-[#f7f6f3]" onClick={() => setMenuOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-display font-medium text-red-600 hover:bg-red-50">
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button onClick={() => setShowLogin(true)}
                className="bg-[#d4720a] hover:bg-[#b85e08] text-white font-display font-semibold text-sm rounded-[10px] px-4 py-2 transition-colors">
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

function NavLink({ href, children }) {
  return (
    <Link href={href}
      className="font-display font-medium text-sm text-[#6b6860] hover:text-[#d4720a] hover:bg-[#fdf0e0] px-3 py-1.5 rounded-[10px] transition-all">
      {children}
    </Link>
  );
}
