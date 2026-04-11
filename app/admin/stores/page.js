'use client';
import { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/admin/DataTable';
import StoreForm from '@/components/admin/StoreForm';

export default function AdminStoresPage() {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [s, c] = await Promise.all([
      fetch('/api/stores').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]);
    setStores(s);
    setCategories(c);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    await fetch(`/api/stores/${id}`, { method: 'DELETE' });
    setStores(prev => prev.filter(s => s.id !== id));
  };

  const handleSave = () => { setEditing(null); setCreating(false); load(); };

  const columns = [
    { key: 'logo', label: '', render: v => <span className="text-2xl">{v}</span> },
    { key: 'name', label: 'Name', render: (v, row) => (
      <div>
        <p className="text-sm font-display font-semibold text-[#1a1916]">{v}</p>
        <p className="text-xs text-[#9e9b96]">{row.slug}</p>
      </div>
    )},
    { key: 'shortDesc', label: 'Description', render: v => <span className="text-xs text-[#6b6860] max-w-[200px] truncate block">{v}</span> },
    { key: '_count', label: 'Offers', render: v => <span className="text-sm text-[#6b6860]">{(v?.deals || 0) + (v?.coupons || 0)}</span> },
    { key: 'featured', label: 'Featured', render: v => <span className={`text-xs font-display font-semibold px-2 py-0.5 rounded-md ${v ? 'bg-yellow-100 text-yellow-700' : 'bg-[#f7f6f3] text-[#9e9b96]'}`}>{v ? 'Yes' : 'No'}</span> },
    { key: 'active', label: 'Status', render: v => <span className={`text-xs font-display font-semibold px-2 py-0.5 rounded-md ${v ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{v ? 'Active' : 'Inactive'}</span> },
  ];

  if (creating || editing) {
    return (
      <div className="p-6 max-w-3xl">
        <button onClick={() => { setCreating(false); setEditing(null); }} className="flex items-center gap-1.5 text-sm font-display font-medium text-[#d4720a] mb-5 hover:underline">
          ← Back to Stores
        </button>
        <h1 className="font-display font-semibold text-xl text-[#1a1916] mb-6">{editing ? 'Edit Store' : 'New Store'}</h1>
        <div className="bg-white border border-[#e5e2db] rounded-xl p-5">
          <StoreForm initial={editing} categories={categories} onSave={handleSave} onCancel={() => { setCreating(false); setEditing(null); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-semibold text-xl text-[#1a1916]">Stores</h1>
          <p className="text-sm text-[#9e9b96]">{stores.length} total stores</p>
        </div>
        <button onClick={() => setCreating(true)}
          className="bg-[#d4720a] hover:bg-[#b85e08] text-white font-display font-semibold text-sm rounded-xl px-4 py-2 transition-colors">
          + New Store
        </button>
      </div>
      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-12 skeleton rounded-lg" />)}</div>
      ) : (
        <DataTable columns={columns} rows={stores} onDelete={handleDelete} onEdit={setEditing} />
      )}
    </div>
  );
}
