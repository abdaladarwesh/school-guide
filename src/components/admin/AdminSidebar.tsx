import { Link } from "@tanstack/react-router";
import { School, Plus, LogOut } from "lucide-react";

export function AdminSidebar() {
  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-50 flex flex-col md:h-screen md:fixed left-0 top-0 z-50">
      <div className="p-4 md:p-6 flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Admin Panel</h2>
        {/* On mobile, show back to site in header */}
        <Link
          to="/"
          className="md:hidden flex items-center gap-2 p-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="sr-only">Back to Site</span>
        </Link>
      </div>
      <nav className="px-4 pb-4 md:pb-0 flex overflow-x-auto gap-2 md:flex-col md:space-y-2 md:flex-1 scrollbar-hide">
        <Link
          to="/admin/schools"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap [&.active]:bg-slate-800 [&.active]:text-blue-400"
        >
          <School className="w-5 h-5" />
          Schools
        </Link>
        <Link
          to="/admin/schools/new"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap [&.active]:bg-slate-800 [&.active]:text-blue-400"
        >
          <Plus className="w-5 h-5" />
          Add School
        </Link>
      </nav>
      <div className="p-4 border-t border-slate-800 hidden md:block mt-auto">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
