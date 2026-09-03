import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { OpportunityForm } from "@/components/admin/OpportunityForm";
import { useOpportunitiesStore } from "@/data/useOpportunitiesStore";

export const Route = createFileRoute("/admin/opportunities/$oppId/edit")({
  component: EditOpportunityPage,
});

function EditOpportunityPage() {
  const { oppId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { opportunities, updateOpportunity, isLoading } = useOpportunitiesStore();
  
  const opp = opportunities.find(o => o.id === oppId);

  const handleSubmit = async (data: any) => {
    if (oppId) {
      await updateOpportunity(oppId, data);
      navigate({ to: "/admin/opportunities" });
    }
  };

  if (!opp) return <div>Opportunity not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Opportunity</h1>
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <OpportunityForm onSubmit={handleSubmit} initialData={opp} isLoading={isLoading} />
      </div>
    </div>
  );
}
