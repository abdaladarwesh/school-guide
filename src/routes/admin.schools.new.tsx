import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SchoolForm } from '@/components/admin/SchoolForm';
import { useSchoolsStore } from '@/data/useSchoolsStore';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/schools/new')({
  component: AddSchoolPage,
});

function AddSchoolPage() {
  const navigate = useNavigate();
  const { addSchool } = useSchoolsStore();

  const handleSubmit = (data: any) => {
    addSchool(data);
    toast.success('School added successfully');
    navigate({ to: '/admin/schools' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New School</h1>
        <p className="text-slate-500 mt-2">Fill in the details below to add a new school to the system.</p>
      </div>
      <SchoolForm onSubmit={handleSubmit} />
    </div>
  );
}
