'use client';
import { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/admin/DataTable';
import OfferForm from '@/components/admin/OfferForm';

export default function AdminDealsPage() {
  const [deals, setDeals] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [d, s, c] = await Promise.all([
      fetch('/api/deals?limit=100').then(r => r.json()),
      fetch('/api/stores').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]);
    setDeals(d.items || []);
    setStores(s);
    setCategories(c);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    await fetch(`/api/deals/${id}`, { method: 'DELETE' });
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  const handleSave = () => { setEditing(null); setCreating(false); load(); };

  const columns = [
    { key: 'store', label: 'Store', render: (v) => <span className="flex items-center gap-1.5 text-sm">{v?.logo} {v?.name}</span> },
    { key: 'title', label: 'Title', render: v => <span className="text-sm font-medium text-[#1a1916] max-w-[200px] truncate block">{v}</span> },
    { key: 'discount', label: 'Discount', render: v => <span className="text-xs font-display font-semibold bg-[#fdf0e0] text-[#d4720a] px-2 py-0.5 rounded-md">{v}</span> },
    { key: 'verified', label: 'Verified', render: v => <span className={`text-xs font-display font-semibold px-2 py-0.5 rounded-md ${v ? 'bg-green-100 text-green-700' : 'bg-[#f7f6f3] text-[#9e9b96]'}`}>{v ? 'Yes' : 'No'}</span> },
    { key: 'clicks', label: 'Clicks', render: v => <span className="text-sm text-[#6b6860]">{v ?? 0}</span> },
    { key: 'active', label: 'Status', render: v => <span className={`text-xs font-display font-semibold px-2 py-0.5 rounded-md ${v ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{v ? 'Active' : 'Inactive'}</span> },
  ];

  if (creating || editing) {
    return (
      <div className="p-6 max-w-3xl">
        <button onClick={() => { setCreating(false); setEditing(null); }} className="flex items-center gap-1.5 text-sm font-display font-medium text-[#d4720a] mb-5 hover:underline">
          ← Back to Deals
        </button>
        <h1 className="font-display font-semibold text-xl text-[#1a1916] mb-6">{editing ? 'Edit Deal' : 'New Deal'}</h1>
        <div className="bg-white border border-[#e5e2db] rounded-xl p-5">
          <OfferForm type="deal" initial={editing} stores={stores} categories={categories} onSave={handleSave} onCancel={() => { setCreating(false); setEditing(null); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-semibold text-xl text-[#1a1916]">Deals</h1>
          <p className="text-sm text-[#9e9b96]">{deals.length} total deals</p>
        </div>
        <button onClick={() => setCreating(true)}
          className="bg-[#d4720a] hover:bg-[#b85e08] text-white font-display font-semibold text-sm rounded-xl px-4 py-2 transition-colors">
          + New Deal
        </button>
      </div>
      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-12 skeleton rounded-lg" />)}</div>
      ) : (
        <DataTable columns={columns} rows={deals} onDelete={handleDelete} onEdit={setEditing} />
      )}
    </div>
  );
}
