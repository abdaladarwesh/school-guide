import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Opportunity } from "@/data/opportunities";

export function OpportunityForm({ onSubmit, initialData, isLoading }: { onSubmit: any, initialData?: Opportunity, isLoading: boolean }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [institution, setInstitution] = useState(initialData?.institution || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id || `opp-${Date.now()}`,
      title,
      institution,
      location: initialData?.location || "TBD",
      category: initialData?.category || "TBD"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input 
          className="w-full border rounded-md p-2" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Institution</label>
        <input 
          className="w-full border rounded-md p-2" 
          value={institution} 
          onChange={e => setInstitution(e.target.value)} 
          required 
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Opportunity"}
      </Button>
    </form>
  );
}
