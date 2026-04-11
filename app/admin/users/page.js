'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(setUsers).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-display font-semibold text-xl text-[#1a1916]">Users</h1>
        <p className="text-sm text-[#9e9b96]">{users.length} registered users</p>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-12 skeleton rounded-lg" />)}</div>
      ) : (
        <div className="bg-white border border-[#e5e2db] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f7f6f3] border-b border-[#e5e2db]">
                {['Name', 'Email', 'Role', 'Joined'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-display font-semibold text-xs text-[#6b6860] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e2db]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#f7f6f3] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#fdf0e0] text-[#d4720a] flex items-center justify-center font-display font-semibold text-xs">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-display font-medium text-[#1a1916]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6b6860]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-display font-semibold px-2 py-0.5 rounded-md ${u.role === 'admin' ? 'bg-[#fdf0e0] text-[#d4720a]' : 'bg-[#f7f6f3] text-[#6b6860]'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#9e9b96] text-xs">
                    {format(new Date(u.createdAt), 'dd MMM yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
