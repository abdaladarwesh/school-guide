import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
