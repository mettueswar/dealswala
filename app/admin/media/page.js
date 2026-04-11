'use client';
import { useState } from 'react';
import MediaGallery from '@/components/admin/MediaGallery';

export default function AdminMediaPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-5">
        <h1 className="font-display font-semibold text-xl text-[#1a1916]">Media Library</h1>
        <p className="text-sm text-[#9e9b96]">Upload and manage images for stores, deals, and site content</p>
      </div>
      <div className="bg-white border border-[#e5e2db] rounded-xl p-5 flex-1 flex flex-col min-h-0">
        <MediaGallery mode="manage" />
      </div>
    </div>
  );
}
