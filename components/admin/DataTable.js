'use client';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';

export default function DataTable({ columns, rows, onDelete, onEdit }) {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  async function handleDelete(id) {
    setDeleting(id);
    try {
      await onDelete(id);
      toast({ message: 'Deleted successfully', type: 'success' });
    } catch {
      toast({ message: 'Delete failed', type: 'error' });
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  }

  if (!rows?.length) {
    return (
      <div className="text-center py-16 text-[#9e9b96] font-display text-sm">No records found.</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#e5e2db]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#f7f6f3] border-b border-[#e5e2db]">
            {columns.map(c => (
              <th key={c.key} className="text-left px-4 py-3 font-display font-semibold text-xs text-[#6b6860] uppercase tracking-wide whitespace-nowrap">
                {c.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-display font-semibold text-xs text-[#6b6860] uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e5e2db]">
          {rows.map(row => (
            <tr key={row.id} className="bg-white hover:bg-[#f7f6f3] transition-colors group">
              {columns.map(c => (
                <td key={c.key} className="px-4 py-3 text-[#1a1916]">
                  {c.render ? c.render(row[c.key], row) : (
                    <span className={c.className || 'text-sm text-[#1a1916]'}>{row[c.key] ?? '—'}</span>
                  )}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                {confirmId === row.id ? (
                  <span className="flex items-center justify-end gap-2">
                    <span className="text-xs text-[#6b6860] font-display">Sure?</span>
                    <button
                      onClick={() => handleDelete(row.id)}
                      disabled={deleting === row.id}
                      className="text-xs font-display font-semibold text-white bg-red-600 hover:bg-red-700 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      {deleting === row.id ? '…' : 'Yes'}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs font-display font-semibold text-[#6b6860] bg-[#f7f6f3] hover:bg-[#e5e2db] px-2.5 py-1 rounded-lg transition-colors"
                    >
                      No
                    </button>
                  </span>
                ) : (
                  <span className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <button onClick={() => onEdit(row)}
                        className="text-xs font-display font-semibold text-[#d4720a] bg-[#fdf0e0] hover:bg-[#d4720a] hover:text-white px-2.5 py-1 rounded-lg transition-colors">
                        Edit
                      </button>
                    )}
                    <button onClick={() => setConfirmId(row.id)}
                      className="text-xs font-display font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-2.5 py-1 rounded-lg transition-colors">
                      Delete
                    </button>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
