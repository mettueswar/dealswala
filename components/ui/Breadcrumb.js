import Link from 'next/link';

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm mb-5 font-display">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-[#e5e2db]">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-[#d4720a] hover:underline">{item.label}</Link>
          ) : (
            <span className="text-[#9e9b96]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
