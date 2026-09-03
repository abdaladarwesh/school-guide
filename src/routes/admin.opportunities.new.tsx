import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OpportunityForm } from "@/components/admin/OpportunityForm";
import { useOpportunitiesStore } from "@/data/useOpportunitiesStore";

export const Route = createFileRoute("/admin/opportunities/new")({
  component: AddOpportunityPage,
});

function AddOpportunityPage() {
  const navigate = useNavigate();
  const { addOpportunity, isLoading } = useOpportunitiesStore();

  const handleSubmit = async (data: any) => {
    await addOpportunity(data);
    navigate({ to: "/admin/opportunities" });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Opportunity</h1>
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <OpportunityForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
