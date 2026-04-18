'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';

export default function OfferModal({ item, type, onClose }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const hasDealImage = type === 'deal' && !!item.imageUrl;

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Track click in background
  useEffect(() => {
    fetch(`/api/${type}s/${item.id}/click`, { method: 'POST' }).catch(() => {});
  }, [item.id, type]);

  function copyCode() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(item.code).catch(() => {});
    } else {
      const el = document.createElement('textarea');
      el.value = item.code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    toast({ message: `Code "${item.code}" copied to clipboard!`, type: 'success' });
    setTimeout(() => setCopied(false), 3000);
  }

  function goToStore() {
    window.open(`/api/go/${type}/${item.id}`, '_blank', 'noopener,noreferrer');
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl w-full max-w-[440px] overflow-hidden animate-slide relative shadow-xl">

        {/* Product image hero — deals with imageUrl only */}
        {hasDealImage && (
          <div className="relative h-48 bg-[#f7f6f3] overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {/* Discount badge over product image */}
            <span className="absolute top-3 left-3 bg-[#d4720a] text-white font-display font-semibold text-xs px-2.5 py-1 rounded-lg shadow">
              {item.discount}
            </span>
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-3 right-3 w-7 h-7 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white text-sm transition-colors"
            >
              ✕
            </button>
            {/* Store logo badge below product image */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5 shadow">
              <div className="w-6 h-6 rounded-lg bg-[#f7f6f3] border border-[#e5e2db] flex items-center justify-center overflow-hidden shrink-0">
                {item.store?.logoUrl ? (
                  <img src={item.store.logoUrl} alt={item.store.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-sm leading-none">{item.store?.logo || '🏷️'}</span>
                )}
              </div>
              <span className="text-xs font-display font-semibold text-[#1a1916]">{item.store?.name}</span>
            </div>
          </div>
        )}

        {/* Standard header — shown when no deal product image */}
        {!hasDealImage && (
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e2db]">
            <div className="w-10 h-10 bg-[#f7f6f3] rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              {item.store?.logoUrl ? (
                <img src={item.store.logoUrl} alt={item.store.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-xl">{item.store?.logo || '🏷️'}</span>
              )}
            </div>
            <div>
              <h3 id="modal-title" className="font-display font-semibold text-sm text-[#1a1916]">
                {item.store?.name}
              </h3>
              <p className="text-xs text-[#9e9b96]">
                {item.verified ? '✓ Verified by our team' : 'Community submitted'}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="ml-auto w-7 h-7 bg-[#f7f6f3] hover:bg-[#e5e2db] rounded-full flex items-center justify-center text-[#6b6860] text-sm transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5">
          {/* Title area — for deal-with-image layout, verified tag moves here */}
          {hasDealImage && (
            <div className="flex items-center gap-2 mb-2">
              {item.verified && (
                <span className="text-[10px] font-display font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                  ✓ Verified
                </span>
              )}
            </div>
          )}

          <h2 className="font-display font-semibold text-base text-[#1a1916] mb-1.5">{item.title}</h2>
          <p className="text-sm text-[#6b6860] leading-relaxed mb-4">{item.description}</p>

          {/* Coupon code block */}
          {type === 'coupon' && item.code ? (
            <div className="bg-[#fdf0e0] border-2 border-dashed border-[#d4720a] rounded-xl p-4 mb-4 text-center">
              <p className="text-xs font-display text-[#9e9b96] mb-1.5">Your coupon code</p>
              <p className="font-display font-semibold text-2xl text-[#d4720a] tracking-[0.2em] mb-3">{item.code}</p>
              <button
                onClick={copyCode}
                className={`font-display font-semibold text-xs px-5 py-2 rounded-lg transition-all ${
                  copied ? 'bg-green-600 text-white' : 'bg-[#d4720a] hover:bg-[#b85e08] text-white'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy Code'}
              </button>
            </div>
          ) : (
            <div className="bg-[#f7f6f3] rounded-xl p-3 mb-4 text-center text-sm text-[#6b6860]">
              No code needed — discount applies automatically at checkout
            </div>
          )}

          {/* CTA */}
          <button
            onClick={goToStore}
            className="w-full bg-[#d4720a] hover:bg-[#b85e08] text-white font-display font-semibold text-sm rounded-xl py-3.5 transition-colors flex items-center justify-center gap-2"
          >
            Visit {item.store?.name} &amp; Activate Offer
            <span className="text-base">↗</span>
          </button>

          {/* Terms */}
          <p className="text-[11px] text-[#9e9b96] text-center mt-3 leading-relaxed">
            {item.expiresAt
              ? `Expires: ${new Date(item.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · `
              : ''}
            Terms &amp; conditions may apply. Discount at merchant's discretion.
          </p>
        </div>
      </div>
    </div>
  );
}