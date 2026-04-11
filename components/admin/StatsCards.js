export default function StatsCards({ stats }) {
  const cards = [
    { label: 'Total Deals', value: stats.deals, icon: '🏷️', color: 'text-blue-700 bg-blue-50' },
    { label: 'Total Coupons', value: stats.coupons, icon: '🎟️', color: 'text-orange-700 bg-orange-50' },
    { label: 'Active Stores', value: stats.stores, icon: '🏪', color: 'text-green-700 bg-green-50' },
    { label: 'Total Users', value: stats.users, icon: '👥', color: 'text-purple-700 bg-purple-50' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(c => (
        <div key={c.label} className="bg-white border border-[#e5e2db] rounded-xl p-4">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base mb-3 ${c.color}`}>{c.icon}</div>
          <p className="font-display font-semibold text-2xl text-[#1a1916]">{c.value?.toLocaleString('en-IN') ?? '—'}</p>
          <p className="text-xs font-display text-[#9e9b96] mt-0.5">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
