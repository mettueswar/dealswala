'use client';
import { useState } from 'react';
import OfferModal from '@/components/modals/OfferModal';
import { isExpired, expiresLabel } from '@/lib/utils';
import { TimerIcon } from 'lucide-react';

export default function OfferCard({ item, type }) {
  const [open, setOpen] = useState(false);
  const expired = isExpired(item.expiresAt);
  const expLabel = expiresLabel(item.expiresAt);

  return (
    <>
      <article
        onClick={() => !expired && setOpen(true)}
        className={`bg-white border border-[#e5e2db] rounded-2xl overflow-hidden transition-all duration-150 group
          ${expired ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-[#d4720a] hover:-translate-y-0.5 hover:shadow-sm'}`}
        aria-label={item.title}
      >
        <div className="bg-[#f7f6f3] h-28 flex items-center justify-center relative overflow-hidden">
          {item.store?.logoUrl
            ? <img src={item.store.logoUrl} alt={item.store.name} className="h-16 w-auto max-w-[60%] object-contain" />
            : <span className="text-5xl">{item.store?.logo || '🏷️'}</span>
          }
          <span className="absolute top-2 left-2 bg-[#d4720a] text-white font-display font-semibold text-xs px-2 py-0.5 rounded-md">
            {item.discount}
          </span>
          {expLabel && (
            <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md"><TimerIcon className="w-3 h-3 mr-1 inline" /> {expLabel}</span>
          )}
          {item.verified && (
            <span className="absolute bottom-2 right-2 bg-green-100 text-green-800 font-display font-semibold text-[10px] px-2 py-0.5 rounded-md">
              ✓ Verified
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs font-display font-semibold text-[#9e9b96] mb-1">{item.store?.name}</p>
          <h3 className="font-display font-semibold text-sm text-[#1a1916] leading-snug mb-1.5 line-clamp-2">{item.title}</h3>
          <p className="text-xs text-[#6b6860] leading-relaxed mb-3 line-clamp-2">{item.description}</p>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-display font-semibold px-2 py-0.5 rounded-md
              ${type === 'deal' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
              {type === 'deal' ? 'DEAL' : 'COUPON'}
            </span>
            {type === 'coupon' ? (
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
