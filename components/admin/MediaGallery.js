'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/context/ToastContext';

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function MediaGallery({ onSelect, selectedUrl, mode = 'manage' }) {
  // mode: 'manage' (full admin), 'pick' (picker modal)
  const { toast } = useToast();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetch('/api/media').then(r => r.json());
      setMedia(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMedia(); }, [loadMedia]);

  async function uploadFiles(files) {
    const list = Array.from(files);
    setUploading(true);
    let successCount = 0;
    for (let i = 0; i < list.length; i++) {
      setUploadProgress(`Uploading ${i + 1}/${list.length}…`);
      const fd = new FormData();
      fd.append('file', list[i]);
      try {
        const res = await fetch('/api/media', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setMedia(prev => [data, ...prev]);
        successCount++;
      } catch (err) {
        toast({ message: `${list[i].name}: ${err.message}`, type: 'error' });
      }
    }
    if (successCount > 0) toast({ message: `${successCount} file${successCount > 1 ? 's' : ''} uploaded!`, type: 'success' });
    setUploading(false);
    setUploadProgress(null);
  }

  function handleFileInput(e) {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setMedia(prev => prev.filter(m => m.id !== id));
      setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
      toast({ message: 'Deleted', type: 'success' });
    } catch (err) {
      toast({ message: err.message, type: 'error' });
    }
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/media/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMedia(prev => prev.filter(m => !selected.has(m.id)));
      setSelected(new Set());
      toast({ message: `${data.deleted} file${data.deleted > 1 ? 's' : ''} deleted`, type: 'success' });
    } catch (err) {
      toast({ message: err.message, type: 'error' });
    } finally {
      setDeleting(false);
    }
  }

  function toggleSelect(id) {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  const filtered = media.filter(m =>
    !search || m.originalName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input
          type="text" placeholder="Search files…" value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[160px] h-9 bg-[#f7f6f3] border border-[#e5e2db] rounded-xl px-3 text-sm text-[#1a1916] outline-none focus:border-[#d4720a] transition-colors"
        />
        {selected.size > 0 && (
          <button onClick={handleBulkDelete} disabled={deleting}
            className="h-9 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-display font-semibold text-xs rounded-xl transition-colors">
            {deleting ? 'Deleting…' : `Delete ${selected.size} selected`}
          </button>
        )}
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="h-9 px-4 bg-[#d4720a] hover:bg-[#b85e08] disabled:opacity-60 text-white font-display font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5">
          {uploading ? uploadProgress || 'Uploading…' : '↑ Upload Files'}
        </button>
        <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileInput} />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-4 mb-4 text-center text-sm transition-all ${
          dragOver ? 'border-[#d4720a] bg-[#fdf0e0] text-[#d4720a]' : 'border-[#e5e2db] text-[#9e9b96]'
        }`}
      >
        {uploading ? (
          <span className="font-display font-medium">{uploadProgress || 'Uploading…'}</span>
        ) : (
          <span>Drag & drop images here, or <button onClick={() => fileRef.current?.click()} className="text-[#d4720a] font-medium underline">browse</button></span>
        )}
      </div>

      {/* Stats */}
      <p className="text-xs text-[#9e9b96] mb-3 font-display">
        {filtered.length} file{filtered.length !== 1 ? 's' : ''}
        {filtered.length !== media.length && ` (${media.length} total)`}
        {selected.size > 0 && ` · ${selected.size} selected`}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {[...Array(12)].map((_, i) => <div key={i} className="aspect-square skeleton rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
          <div className="text-4xl mb-3">🖼️</div>
          <p className="font-display font-semibold text-[#1a1916]">No files yet</p>
          <p className="text-sm text-[#9e9b96] mt-1">Upload images to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 overflow-y-auto">
          {filtered.map(item => {
            const isSelected = selected.has(item.id);
            const isActive = selectedUrl === item.url;
            return (
              <div key={item.id}
                onClick={() => mode === 'pick' ? onSelect?.(item) : toggleSelect(item.id)}
                className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all
                  ${isActive ? 'border-[#d4720a] ring-2 ring-[#d4720a]/30' :
                    isSelected ? 'border-[#d4720a]' : 'border-[#e5e2db] hover:border-[#d4720a]'}`}
              >
                {/* Image */}
                <img
                  src={item.url} alt={item.originalName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 transition-opacity
                  ${isSelected || isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {mode === 'pick' ? (
                    <span className="text-white font-display font-semibold text-xs bg-[#d4720a] px-2 py-1 rounded-lg">
                      {isActive ? '✓ Selected' : 'Select'}
                    </span>
                  ) : (
                    <>
                      {isSelected && <span className="text-white text-lg">✓</span>}
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                        className="text-white bg-red-600 hover:bg-red-700 font-display font-semibold text-[10px] px-2 py-1 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>

                {/* Size badge */}
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-display">
                  {formatBytes(item.size)}
                </span>

                {/* Dimensions badge */}
                {item.width && (
                  <span className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-display">
                    {item.width}×{item.height}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
