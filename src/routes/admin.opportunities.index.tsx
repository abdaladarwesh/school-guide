import { createFileRoute, Link } from "@tanstack/react-router";
import { useOpportunitiesStore } from "@/data/useOpportunitiesStore";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/opportunities/")({
  component: AdminOpportunitiesIndex,
});

function AdminOpportunitiesIndex() {
  const { opportunities, deleteOpportunity } = useOpportunitiesStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Opportunities</h1>
        <Button asChild>
          <Link to="/admin/opportunities/new"><Plus className="w-4 h-4 mr-2" /> Add New</Link>
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Institution</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opp) => (
              <tr key={opp.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{opp.title}</td>
                <td className="px-6 py-4">{opp.institution}</td>
                <td className="px-6 py-4">{opp.category}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/opportunities/$oppId/edit" params={{ oppId: opp.id }}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteOpportunity(opp.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {opportunities.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No opportunities found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
