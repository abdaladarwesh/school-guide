import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useUserStore } from "@/data/useUserStore";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    const role = useUserStore.getState().adminRole;
    if (role !== "admin") {
      throw redirect({
        to: "/admin-login",
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 w-full max-w-full overflow-x-hidden flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
