'use client';
import { useState } from 'react';
import OfferModal from '@/components/modals/OfferModal';
import { isExpired, expiresLabel } from '@/lib/utils';
import { TimerIcon } from 'lucide-react';

export default function OfferCard({ item, type }) {
  const [open, setOpen] = useState(false);
  const expired = isExpired(item.expiresAt);
  const expLabel = expiresLabel(item.expiresAt);

  const isCoupon = type === 'coupon';
  const hasDealImage = type === 'deal' && !!item.imageUrl;

  return (
    <>
      <article
        onClick={() => !expired && setOpen(true)}
        className={`bg-white border border-[#e5e2db] rounded-2xl overflow-hidden transition-all duration-150 group
          ${expired ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-[#d4720a] hover:-translate-y-0.5 hover:shadow-sm'}`}
        aria-label={item.title}
      >
        {/* ── Hero ── */}
        {isCoupon ? (
          /* COUPON: big discount as hero, store logo badge bottom-left */
          <div className="h-28 relative overflow-hidden bg-gradient-to-br from-[#fff7ed] to-[#fde8c8] flex items-center justify-center">
            {/* Dashed top & bottom edge */}
            <div className="absolute inset-x-0 top-0 h-px"
              style={{ backgroundImage: 'repeating-linear-gradient(90deg,#d4720a 0,#d4720a 6px,transparent 6px,transparent 12px)' }} />
            <div className="absolute inset-x-0 bottom-0 h-px"
              style={{ backgroundImage: 'repeating-linear-gradient(90deg,#d4720a 0,#d4720a 6px,transparent 6px,transparent 12px)' }} />

            {/* Big discount text */}
            <span className="font-display font-semibold text-2xl text-[#d4720a] tracking-tight px-4 text-center leading-tight">
              {item.discount}
            </span>

            {/* Expiry — top-right */}
            {expLabel && (
              <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                <TimerIcon className="w-3 h-3" /> {expLabel}
              </span>
            )}

            {/* Verified — top-left */}
            {item.verified && (
              <span className="absolute top-2 left-2 bg-gray-100 text-green-800 font-display font-semibold text-[10px] px-2 py-0.5 rounded-md">
                ✓ Verified
              </span>
            )}

            {/* Store logo pill — bottom-left */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
              <div className="w-5 h-5 rounded flex items-center justify-center overflow-hidden shrink-0">
                {item.store?.logoUrl
                  ? <img src={item.store.logoUrl} alt={item.store.name} className="w-full h-full object-contain" />
                  : <span className="text-sm leading-none">{item.store?.logo || '🏷️'}</span>
                }
              </div>
              <span className="text-[11px] font-display font-semibold text-[#1a1916] leading-none">{item.store?.name}</span>
            </div>
          </div>
        ) : hasDealImage ? (
          /* DEAL with product image */
          <div className="h-28 relative overflow-hidden">
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain" />

            <span className="absolute top-2 left-2 bg-[#d4720a] text-white font-display font-semibold text-xs px-2 py-0.5 rounded-md">
              {item.discount}
            </span>
            {expLabel && (
              <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                <TimerIcon className="w-3 h-3" /> {expLabel}
              </span>
            )}
            {item.verified && (
              <span className="absolute bottom-2 right-2 bg-gray-100 text-green-800 font-display font-semibold text-[10px] px-2 py-0.5 rounded-md">
                ✓ Verified
              </span>
            )}

            {/* Store logo badge — bottom-left */}
            <div className="absolute bottom-2 left-2 w-8 h-8 rounded-lg bg-white border border-white/80 shadow flex items-center justify-center overflow-hidden">
              {item.store?.logoUrl
                ? <img src={item.store.logoUrl} alt={item.store.name} className="w-full h-full object-contain p-0.5" />
                : <span className="text-base leading-none">{item.store?.logo || '🏷️'}</span>
              }
            </div>
          </div>
        ) : (
          /* DEAL without product image — store logo as hero */
          <div className="h-28 bg-[#f7f6f3] flex items-center justify-center relative overflow-hidden">
            {item.store?.logoUrl
              ? <img src={item.store.logoUrl} alt={item.store.name} className="h-16 w-auto max-w-[60%] object-contain" />
              : <span className="text-5xl">{item.store?.logo || '🏷️'}</span>
            }
            <span className="absolute top-2 left-2 bg-[#d4720a] text-white font-display font-semibold text-xs px-2 py-0.5 rounded-md">
              {item.discount}
            </span>
            {expLabel && (
              <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                <TimerIcon className="w-3 h-3" /> {expLabel}
              </span>
            )}
            {item.verified && (
              <span className="absolute bottom-2 right-2 bg-green-100 text-green-800 font-display font-semibold text-[10px] px-2 py-0.5 rounded-md">
                ✓ Verified
              </span>
            )}
          </div>
        )}

        {/* ── Card body ── */}
        <div className="p-4">
          {/* Store name row — hidden for coupons (already in hero badge) */}
          {!isCoupon && (
            <p className="text-xs font-display font-semibold text-[#9e9b96] mb-1">{item.store?.name}</p>
          )}
          <h3 className="font-display font-semibold text-sm text-[#1a1916] leading-snug mb-1.5 line-clamp-2">{item.title}</h3>
          <p className="text-xs text-[#6b6860] leading-relaxed mb-3 line-clamp-2">{item.description}</p>

          <div className="flex items-center justify-between">
            {/* <span className={`text-xs font-display font-semibold px-2 py-0.5 rounded-md
              ${isCoupon ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
              {isCoupon ? 'COUPON' : 'DEAL'}
            </span> */}
            {isCoupon ? (
              <span className="bg-[#fdf0e0] border border-dashed border-[#d4720a] text-[#d4720a] font-display font-semibold text-xs px-3 py-1 rounded-md tracking-widest">
                {item.code}
              </span>
            ) : (
              <span className="bg-[#fdf0e0] text-[#d4720a] border border-[#d4720a] font-display font-semibold text-xs px-3 py-1.5 rounded-[8px] group-hover:bg-[#d4720a] group-hover:text-white transition-colors">
                Get Deal
              </span>
            )}
          </div>
        </div>
      </article>

      {open && <OfferModal item={item} type={type} onClose={() => setOpen(false)} />}
    </>
  );
}