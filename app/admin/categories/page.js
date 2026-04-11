'use client';
import { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/admin/DataTable';
import { useToast } from '@/context/ToastContext';

const inp = 'w-full h-10 bg-[#f7f6f3] border border-[#e5e2db] rounded-xl px-3 text-sm text-[#1a1916] outline-none focus:border-[#d4720a] transition-colors';

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', slug: '', icon: '🏷️', order: 0 });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetch('/api/categories').then(r => r.json());
    setCats(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function setF(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleName(name) {
    setF('name', name);
    if (!editing) setF('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  }

  function startEdit(row) {
    setEditing(row);
    setForm({ name: row.name, slug: row.slug, icon: row.icon, order: row.order });
  }

  function cancelEdit() { setEditing(null); setForm({ name: '', slug: '', icon: '🏷️', order: 0 }); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/categories/${editing.id}` : '/api/categories';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ message: `Category ${editing ? 'updated' : 'created'}!`, type: 'success' });
      cancelEdit();
      load();
    } catch (err) {
      toast({ message: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  const handleDelete = async (id) => {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    setCats(prev => prev.filter(c => c.id !== id));
  };

  const columns = [
    { key: 'icon', label: '', render: v => <span className="text-2xl">{v}</span> },
    { key: 'name', label: 'Name', render: (v, row) => <div><p className="text-sm font-display font-semibold text-[#1a1916]">{v}</p><p className="text-xs text-[#9e9b96]">{row.slug}</p></div> },
    { key: '_count', label: 'Offers', render: v => <span className="text-sm text-[#6b6860]">{(v?.deals || 0) + (v?.coupons || 0)}</span> },
    { key: 'order', label: 'Order', render: v => <span className="text-sm text-[#6b6860]">{v}</span> },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-semibold text-xl text-[#1a1916]">Categories</h1>
          <p className="text-sm text-[#9e9b96]">{cats.length} categories</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-[#e5e2db] rounded-xl p-5 mb-6">
        <h2 className="font-display font-semibold text-sm text-[#1a1916] mb-4">{editing ? 'Edit Category' : 'New Category'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-display font-semibold text-[#6b6860] mb-1.5">Name *</label>
            <input required value={form.name} onChange={e => handleName(e.target.value)} className={inp} placeholder="Electronics" />
          </div>
          <div>
            <label className="block text-xs font-display font-semibold text-[#6b6860] mb-1.5">Slug *</label>
            <input required value={form.slug} onChange={e => setF('slug', e.target.value)} className={inp} placeholder="electronics" />
          </div>
          <div>
            <label className="block text-xs font-display font-semibold text-[#6b6860] mb-1.5">Icon Emoji</label>
            <input value={form.icon} onChange={e => setF('icon', e.target.value)} className={inp} placeholder="💻" />
          </div>
          <div>
            <label className="block text-xs font-display font-semibold text-[#6b6860] mb-1.5">Sort Order</label>
            <input type="number" value={form.order} onChange={e => setF('order', parseInt(e.target.value) || 0)} className={inp} />
          </div>
          <div className="col-span-2 md:col-span-4 flex gap-2">
            <button type="submit" disabled={saving}
              className="bg-[#d4720a] hover:bg-[#b85e08] disabled:opacity-60 text-white font-display font-semibold text-sm rounded-xl px-5 py-2 transition-colors">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
            {editing && (
              <button type="button" onClick={cancelEdit}
                className="bg-[#f7f6f3] hover:bg-[#e5e2db] text-[#1a1916] font-display font-semibold text-sm rounded-xl px-5 py-2 transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-12 skeleton rounded-lg" />)}</div>
      ) : (
        <DataTable columns={columns} rows={cats} onDelete={handleDelete} onEdit={startEdit} />
      )}
    </div>
  );
}
