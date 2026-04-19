"use client";
import { useState } from "react";
import { isExpired, expiresLabel } from "@/lib/utils";
import {
  TimerIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UsersIcon,
  CheckCircleIcon,
} from "lucide-react";

export default function StoreOfferRow({ item, type }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const isCoupon = type === "coupon";
  const expired = isExpired(item.expiresAt);
  const expLabel = expiresLabel(item.expiresAt);

  function handleCTA(e) {
    e.stopPropagation();
    fetch(`/api/${type}s/${item.id}/click`, { method: "POST" }).catch(() => {});
    if (isCoupon && item.code) {
      navigator.clipboard?.writeText(item.code).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
    window.open(`/api/go/${type}/${item.id}`, "_blank", "noopener,noreferrer");
  }

  // Peek image: use deal imageUrl, then store logoUrl, else null (show emoji)
  const peekImage =
    type === "deal" && item.imageUrl
      ? item.imageUrl
      : item.store?.logoUrl || null;

  return (
    <div
      className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200
      ${expired ? "opacity-60 border-[#e5e2db]" : "border-[#e5e2db] hover:border-[#d4720a] hover:shadow-md"}`}
    >
      {/* ── Main row ── */}
      <div className="flex items-stretch min-h-[120px]">
        {/* Discount column */}
        <div
          className="w-20 sm:w-24 shrink-0 flex items-center justify-center px-3 py-4
          bg-gradient-to-b from-[#fff7ed] to-[#fef3e2]"
        >
          <span className="font-display font-bold text-[#d4720a] text-center leading-[1.15] text-lg sm:text-2xl break-words">
            {item.discount}
          </span>
        </div>

        {/* Vertical divider */}
        <div className="w-px bg-[#e5e2db] shrink-0 self-stretch" />

        {/* Middle — title + expand toggle */}
        <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-center">
          <h3 className="font-display font-semibold text-lg sm:text-2xl text-[#1a1916] leading-snug mb-1.5 line-clamp-2">
            {item.title}
          </h3>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs font-display font-semibold text-[#d4720a] hover:underline w-fit"
          >
            Show Details
            {expanded ? (
              <ChevronUpIcon className="w-3.5 h-3.5" />
            ) : (
              <ChevronDownIcon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Right — badges + CTA + peek image */}
        <div className="shrink-0 flex items-stretch">
          {/* Badges + CTA */}
          <div className="flex flex-col items-end justify-center gap-2 px-3 sm:px-4 py-3">
            {/* Badges row */}
            <div className="flex items-center gap-3 flex-wrap justify-end">
              {item.verified && (
                <span className="flex items-center gap-1 text-xs font-display font-semibold text-green-600">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
              {item.clicks > 0 && (
                <span className="flex items-center gap-1 text-xs font-display text-[#9e9b96]">
                  <UsersIcon className="w-3.5 h-3.5" />
                  {item.clicks} uses
                </span>
              )}
              {expLabel && (
                <span className="flex items-center gap-1 text-xs font-display text-[#9e9b96]">
                  <TimerIcon className="w-3.5 h-3.5" />
                  {expLabel}
                </span>
              )}
            </div>

            {/* CTA button */}
            <button
              onClick={handleCTA}
              disabled={expired}
              className={`font-display font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 rounded-xl transition-colors whitespace-nowrap
                ${
                  expired
                    ? "bg-[#e5e2db] text-[#9e9b96] cursor-not-allowed"
                    : isCoupon
                      ? copied
                        ? "bg-green-600 text-white"
                        : "bg-[#d4720a] hover:bg-[#b85e08] text-white"
                      : "bg-[#d4720a] hover:bg-[#b85e08] text-white"
                }`}
            >
              {expired
                ? "Expired"
                : isCoupon
                  ? copied
                    ? "✓ Code Copied!"
                    : "UNLOCK COUPON CODE"
                  : "GET DEAL"}
            </button>
          </div>

          {/* Peek image — partially cropped at right edge */}
          {/* <div className="w-10 sm:w-14 shrink-0 self-stretch overflow-hidden relative bg-[#f7f6f3]">
            {peekImage ? (
              <img
                src={peekImage}
                alt={item.store?.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-40">
                {item.store?.logo || "🏷️"}
              </div>
            )}
           
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent pointer-events-none" />
          </div> */}
        </div>
      </div>

      {/* ── Expanded details panel ── */}
      {expanded && (
        <div className="border-t border-[#e5e2db] px-5 py-4 bg-[#fafaf8] animate-in">
          <p className="text-sm text-[#6b6860] leading-relaxed mb-3">
            {item.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {isCoupon && item.code && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-display font-semibold text-[#9e9b96]">
                  Code:
                </span>
                <span className="bg-[#fdf0e0] border border-dashed border-[#d4720a] text-[#d4720a] font-display font-bold text-sm px-3 py-1 rounded-lg tracking-widest">
                  {item.code}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(item.code).catch(() => {});
                    setCopied(true);
                    setTimeout(() => setCopied(false), 3000);
                  }}
                  className="text-xs font-display font-semibold text-[#d4720a] hover:underline"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
            )}
            {item.expiresAt && (
              <span className="text-xs text-[#9e9b96] font-display">
                Expires:{" "}
                {new Date(item.expiresAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
            <span className="text-xs text-[#9e9b96] font-display">
              T&amp;C apply
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
