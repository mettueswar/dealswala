import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="font-display font-semibold text-3xl text-[#1a1916] mb-2">Page Not Found</h1>
      <p className="text-[#6b6860] mb-6 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/" className="bg-[#d4720a] hover:bg-[#b85e08] text-white font-display font-semibold text-sm rounded-xl px-6 py-3 transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
