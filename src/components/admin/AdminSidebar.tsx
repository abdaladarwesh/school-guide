import { Link } from '@tanstack/react-router';
import { School, Plus, LogOut } from 'lucide-react';

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-50 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link
          to="/admin/schools"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors [&.active]:bg-slate-800 [&.active]:text-blue-400"
        >
          <School className="w-5 h-5" />
          Schools
        </Link>
        <Link
          to="/admin/schools/new"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors [&.active]:bg-slate-800 [&.active]:text-blue-400"
        >
          <Plus className="w-5 h-5" />
          Add School
        </Link>
      </nav>
      <div className="p-4 border-t border-slate-800">
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
