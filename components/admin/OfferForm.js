'use client';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import MediaPickerModal from '@/components/modals/MediaPickerModal';

export default function OfferForm({ type, initial, stores, categories, onSave, onCancel }) {
  const { toast } = useToast();
  const isCoupon = type === 'coupon';
  const isDeal = type === 'deal';

  const [form, setForm] = useState({
    title: '', description: '', discount: '', affLink: '',
    storeId: '', categoryId: '', expiresAt: '', verified: false, featured: false, active: true,
    ...(isCoupon ? { code: '' } : {}),
    ...(isDeal ? { imageUrl: '' } : {}),
    ...initial,
    expiresAt: initial?.expiresAt ? new Date(initial.expiresAt).toISOString().slice(0, 10) : '',
    imageUrl: initial?.imageUrl || '',
  });
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = initial?.id ? `/api/${type}s/${initial.id}` : `/api/${type}s`;
      const method = initial?.id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, expiresAt: form.expiresAt || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      toast({ message: `${isCoupon ? 'Coupon' : 'Deal'} ${initial?.id ? 'updated' : 'created'}!`, type: 'success' });
      onSave(data);
    } catch (err) {
      toast({ message: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title *">
            <input required value={form.title} onChange={e => set('title', e.target.value)} className={inp} placeholder="e.g. Flat ₹200 Off on ₹999+" />
          </Field>
          <Field label="Discount Label *">
            <input required value={form.discount} onChange={e => set('discount', e.target.value)} className={inp} placeholder="e.g. ₹200 OFF or 30% OFF" />
          </Field>
          {isCoupon && (
            <Field label="Coupon Code *">
              <input required value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} className={`${inp} tracking-widest font-display font-semibold`} placeholder="CODE123" />
            </Field>
          )}
          <Field label="Affiliate Link *">
            <input required type="url" value={form.affLink} onChange={e => set('affLink', e.target.value)} className={inp} placeholder="https://..." />
          </Field>
          <Field label="Store *">
            <select required value={form.storeId} onChange={e => set('storeId', e.target.value)} className={inp}>
              <option value="">Select store…</option>
              {stores.map(s => <option key={s.id} value={s.id}>{s.logo} {s.name}</option>)}
            </select>
          </Field>
          <Field label="Category">
            <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)} className={inp}>
              <option value="">Select category…</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </Field>
          <Field label="Expires On">
            <input type="date" value={form.expiresAt} onChange={e => set('expiresAt', e.target.value)} className={inp} />
          </Field>
        </div>

        <Field label="Description *">
          <textarea required rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={`${inp} resize-none`} placeholder="Describe the offer…" />
        </Field>

        {/* Product Image — deals only */}
        {isDeal && (
          <Field label="Product Image (optional — shown on card instead of store logo)">
            <div className="flex items-center gap-3">
              {form.imageUrl ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#e5e2db] bg-[#f7f6f3] shrink-0">
                  <img src={form.imageUrl} alt="product" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => set('imageUrl', '')}
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center hover:bg-red-700 transition-colors">
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-[#e5e2db] bg-[#f7f6f3] flex flex-col items-center justify-center shrink-0 gap-1">
                  <span className="text-2xl">🖼️</span>
                  <span className="text-[10px] text-[#9e9b96] font-display">No image</span>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <button type="button" onClick={() => setShowPicker(true)}
                  className="font-display font-semibold text-xs bg-[#f7f6f3] hover:bg-[#e5e2db] border border-[#e5e2db] text-[#1a1916] px-3 py-2 rounded-xl transition-colors">
                  {form.imageUrl ? '🖼️ Change Image' : '🖼️ Pick from Gallery'}
                </button>
                {form.imageUrl && (
                  <button type="button" onClick={() => set('imageUrl', '')}
                    className="font-display font-semibold text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-xl transition-colors">
                    Remove Image
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-[#9e9b96] mt-1.5 font-display">
              When set, the product image fills the card — the store logo appears as a small badge. Upload images in the Media Library first.
            </p>
          </Field>
        )}

        <div className="flex items-center gap-6">
          {[['verified', 'Verified'], ['featured', 'Featured'], ['active', 'Active']].map(([k, l]) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form[k]} onChange={e => set(k, e.target.checked)}
                className="w-4 h-4 rounded accent-[#d4720a]" />
              <span className="text-sm font-display font-medium text-[#1a1916]">{l}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-[#d4720a] hover:bg-[#b85e08] disabled:opacity-60 text-white font-display font-semibold text-sm rounded-xl px-6 py-2.5 transition-colors">
            {saving ? 'Saving…' : initial?.id ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={onCancel}
            className="bg-[#f7f6f3] hover:bg-[#e5e2db] text-[#1a1916] font-display font-semibold text-sm rounded-xl px-6 py-2.5 transition-colors">
            Cancel
          </button>
        </div>
      </form>

      {showPicker && (
        <MediaPickerModal
          selectedUrl={form.imageUrl}
          onSelect={url => set('imageUrl', url)}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-display font-semibold text-[#6b6860] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inp = 'w-full h-10 bg-[#f7f6f3] border border-[#e5e2db] rounded-xl px-3 text-sm text-[#1a1916] outline-none focus:border-[#d4720a] transition-colors';