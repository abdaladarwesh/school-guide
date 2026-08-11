import { Link } from "@tanstack/react-router";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { useSchoolsStore } from "@/data/useSchoolsStore";
import { useState } from "react";
import { toast } from "sonner";

export function SchoolsDataTable() {
  const { schools, deleteSchool } = useSchoolsStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
        <Link
          to="/admin/schools/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Add New School
        </Link>
      </div>

      <div className="border rounded-lg shadow-sm bg-white overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 border-b uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">Name</th>
              <th className="px-6 py-4 font-semibold tracking-wider">City</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Partner</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Students</th>
              <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {schools.map((school) => (
              <tr key={school.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{school.name}</td>
                <td className="px-6 py-4 text-slate-600">{school.city}</td>
                <td className="px-6 py-4 text-slate-600">{school.partner}</td>
                <td className="px-6 py-4 text-slate-600">{school.students}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      to="/admin/schools/$schoolId/edit"
                      params={{ schoolId: school.id }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      disabled={deletingId === school.id}
                      onClick={async () => {
                        if (confirm("Are you sure you want to delete this school?")) {
                          setDeletingId(school.id);
                          try {
                            await deleteSchool(school.id);
                            toast.success("School deleted successfully");
                          } catch (e) {
                            toast.error("Failed to delete school");
                          } finally {
                            setDeletingId(null);
                          }
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      {deletingId === school.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {schools.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No schools found. Add your first school.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
