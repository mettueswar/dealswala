'use client';
import { useEffect } from 'react';
import MediaGallery from '@/components/admin/MediaGallery';

export default function MediaPickerModal({ selectedUrl, onSelect, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  function handleSelect(item) {
    onSelect(item.url);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e2db] shrink-0">
          <h2 className="font-display font-semibold text-base text-[#1a1916]">Media Library</h2>
          <button onClick={onClose}
            className="w-7 h-7 bg-[#f7f6f3] hover:bg-[#e5e2db] rounded-full flex items-center justify-center text-[#6b6860] text-sm transition-colors">
            ✕
          </button>
        </div>

        {/* Gallery */}
        <div className="flex-1 overflow-y-auto p-5">
          <MediaGallery mode="pick" selectedUrl={selectedUrl} onSelect={handleSelect} />
        </div>

        <div className="px-5 py-3 border-t border-[#e5e2db] shrink-0 flex items-center justify-between">
          <p className="text-xs text-[#9e9b96] font-display">Click an image to select it, or upload new ones above</p>
          <button onClick={onClose}
            className="font-display font-semibold text-sm text-[#6b6860] bg-[#f7f6f3] hover:bg-[#e5e2db] px-4 py-2 rounded-xl transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
