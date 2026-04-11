'use client';
export default function Error({ reset }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="font-display font-semibold text-2xl text-[#1a1916] mb-2">Something went wrong</h2>
      <p className="text-[#6b6860] mb-6 max-w-sm text-sm">An unexpected error occurred. Please try again.</p>
      <button onClick={reset} className="bg-[#d4720a] hover:bg-[#b85e08] text-white font-display font-semibold text-sm rounded-xl px-6 py-3 transition-colors">
        Try Again
      </button>
    </div>
  );
}
