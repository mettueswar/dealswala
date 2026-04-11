import AdminSidebar from '@/components/layout/AdminSidebar';

export const metadata = { title: 'Admin — DealWala', robots: { index: false } };

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f7f6f3]">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
