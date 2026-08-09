import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SchoolForm } from '@/components/admin/SchoolForm';
import { useSchoolsStore } from '@/data/useSchoolsStore';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/schools/$schoolId/edit')({
  component: EditSchoolPage,
});

function EditSchoolPage() {
  const { schoolId } = Route.useParams();
  const navigate = useNavigate();
  const { schools, updateSchool } = useSchoolsStore();
  
  const school = schools.find((s) => s.id === schoolId);

  if (!school) {
    return <div className="p-8 text-center text-red-500">School not found.</div>;
  }

  const handleSubmit = (data: any) => {
    updateSchool(schoolId, data);
    toast.success('School updated successfully');
    navigate({ to: '/admin/schools' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit School: {school.name}</h1>
        <p className="text-slate-500 mt-2">Update the details for this school.</p>
      </div>
      <SchoolForm initialData={school} onSubmit={handleSubmit} />
    </div>
  );
}
