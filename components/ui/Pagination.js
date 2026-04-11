'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function Pagination({ total, page, pageSize = 12 }) {
  const pages = Math.ceil(total / pageSize);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pages <= 1) return null;

  function go(p) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p);
    router.push(`${pathname}?${params.toString()}`);
  }

  const range = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) range.push(i);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <PBtn disabled={page === 1} onClick={() => go(page - 1)}>← Prev</PBtn>
      {range[0] > 1 && <><PBtn onClick={() => go(1)}>1</PBtn>{range[0] > 2 && <span className="text-[#9e9b96] text-sm px-1">…</span>}</>}
      {range.map(n => (
        <PBtn key={n} active={n === page} onClick={() => go(n)}>{n}</PBtn>
      ))}
      {range[range.length - 1] < pages && <><span className="text-[#9e9b96] text-sm px-1">…</span><PBtn onClick={() => go(pages)}>{pages}</PBtn></>}
      <PBtn disabled={page === pages} onClick={() => go(page + 1)}>Next →</PBtn>
    </div>
  );
}

function PBtn({ children, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[36px] h-9 px-2.5 rounded-lg text-sm font-display font-medium transition-all
        ${active ? 'bg-[#d4720a] text-white' : 'bg-white border border-[#e5e2db] text-[#6b6860] hover:border-[#d4720a] hover:text-[#d4720a]'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}
