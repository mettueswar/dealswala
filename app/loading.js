export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="h-8 skeleton rounded-xl w-48 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-[#e5e2db] rounded-2xl overflow-hidden">
            <div className="h-28 skeleton" />
            <div className="p-4 space-y-2">
              <div className="h-3 skeleton rounded w-1/3" />
              <div className="h-4 skeleton rounded w-3/4" />
              <div className="h-3 skeleton rounded w-full" />
              <div className="h-3 skeleton rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
