'use client';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import MediaPickerModal from '@/components/modals/MediaPickerModal';

export default function StoreForm({ initial, categories, onSave, onCancel }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '', slug: '', logo: '🛒', logoUrl: '', website: '', affLink: '',
    shortDesc: '', longDesc: '', categoryId: '', featured: false, active: true,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleName(name) {
    set('name', name);
    if (!initial?.id) {
      set('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = initial?.id ? `/api/stores/${initial.id}` : '/api/stores';
      const method = initial?.id ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      toast({ message: `Store ${initial?.id ? 'updated' : 'created'}!`, type: 'success' });
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
          <Field label="Store Name *">
            <input required value={form.name} onChange={e => handleName(e.target.value)} className={inp} placeholder="e.g. Amazon India" />
          </Field>
          <Field label="Slug *">
            <input required value={form.slug} onChange={e => set('slug', e.target.value)} className={inp} placeholder="e.g. amazon" />
          </Field>
          <Field label="Logo Emoji (fallback)">
            <input value={form.logo} onChange={e => set('logo', e.target.value)} className={inp} placeholder="🛒" />
          </Field>
          <Field label="Category">
            <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)} className={inp}>
              <option value="">Select…</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </Field>
          <Field label="Website URL">
            <input type="url" value={form.website} onChange={e => set('website', e.target.value)} className={inp} placeholder="https://amazon.in" />
          </Field>
          <Field label="Affiliate Link *">
            <input required type="url" value={form.affLink} onChange={e => set('affLink', e.target.value)} className={inp} placeholder="https://amazon.in?tag=dealwala" />
          </Field>
        </div>

        {/* Logo Image Picker */}
        <Field label="Store Logo Image (from Media Library)">
          <div className="flex items-center gap-3">
            {form.logoUrl ? (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#e5e2db] bg-[#f7f6f3] shrink-0">
                <img src={form.logoUrl} alt="logo" className="w-full h-full object-contain" />
                <button type="button" onClick={() => set('logoUrl', '')}
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center hover:bg-red-700 transition-colors">
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-[#e5e2db] bg-[#f7f6f3] flex items-center justify-center text-3xl shrink-0">
                {form.logo}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button type="button" onClick={() => setShowPicker(true)}
                className="font-display font-semibold text-xs bg-[#f7f6f3] hover:bg-[#e5e2db] border border-[#e5e2db] text-[#1a1916] px-3 py-2 rounded-xl transition-colors">
                {form.logoUrl ? '🖼️ Change Image' : '🖼️ Pick from Gallery'}
              </button>
              {form.logoUrl && (
                <p className="text-[10px] text-[#9e9b96] font-display truncate max-w-[200px]">{form.logoUrl}</p>
              )}
            </div>
          </div>
          <p className="text-xs text-[#9e9b96] mt-1.5 font-display">Image overrides the emoji. Upload in Media Library first.</p>
        </Field>

        <Field label="Short Description * (shown in store card & SEO meta)">
          <input required value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)} className={inp}
            placeholder="Brief one-line description of the store" maxLength={180} />
          <p className="text-xs text-[#9e9b96] mt-1">{form.shortDesc.length}/180 chars</p>
        </Field>

        <Field label="Long Description (HTML — h2, p, ul, li, strong, em, a)">
          <div className="rounded-xl overflow-hidden border border-[#e5e2db] focus-within:border-[#d4720a] transition-colors">
            <div className="bg-[#f7f6f3] border-b border-[#e5e2db] px-3 py-2 flex gap-2 flex-wrap">
              {[['<h2>', 'H2'], ['<p>', 'Para'], ['<ul>\n  <li>', 'List'], ['<strong>', 'Bold'], ['<em>', 'Italic']].map(([tag, label]) => (
                <button type="button" key={label}
                  onClick={() => set('longDesc', form.longDesc + tag)}
                  className="text-xs font-display font-semibold bg-white border border-[#e5e2db] text-[#6b6860] px-2 py-1 rounded-lg hover:border-[#d4720a] hover:text-[#d4720a] transition-colors">
                  {label}
                </button>
              ))}
            </div>
            <textarea rows={8} value={form.longDesc} onChange={e => set('longDesc', e.target.value)}
              className="w-full bg-white px-3 py-2 text-sm text-[#1a1916] font-mono outline-none resize-none"
              placeholder={'<h2>About Store</h2>\n<p>Description here...</p>\n<ul>\n  <li>Feature one</li>\n</ul>'} />
          </div>
        </Field>

        <div className="flex items-center gap-6">
          {[['featured', 'Featured'], ['active', 'Active']].map(([k, l]) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form[k]} onChange={e => set(k, e.target.checked)} className="w-4 h-4 rounded accent-[#d4720a]" />
              <span className="text-sm font-display font-medium text-[#1a1916]">{l}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-[#d4720a] hover:bg-[#b85e08] disabled:opacity-60 text-white font-display font-semibold text-sm rounded-xl px-6 py-2.5 transition-colors">
            {saving ? 'Saving…' : initial?.id ? 'Update Store' : 'Create Store'}
          </button>
          <button type="button" onClick={onCancel}
            className="bg-[#f7f6f3] hover:bg-[#e5e2db] text-[#1a1916] font-display font-semibold text-sm rounded-xl px-6 py-2.5 transition-colors">
            Cancel
          </button>
        </div>
      </form>

      {showPicker && (
        <MediaPickerModal
          selectedUrl={form.logoUrl}
          onSelect={url => set('logoUrl', url)}
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
