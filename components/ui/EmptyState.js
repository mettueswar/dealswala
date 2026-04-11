export default function EmptyState({ icon = '🔍', title = 'Nothing found', desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display font-semibold text-lg text-[#1a1916] mb-2">{title}</h3>
      {desc && <p className="text-sm text-[#6b6860] max-w-xs">{desc}</p>}
    </div>
  );
}
