import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SchoolForm } from "@/components/admin/SchoolForm";
import { useSchoolsStore } from "@/data/useSchoolsStore";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/schools/$schoolId/edit")({
  component: EditSchoolPage,
});

function EditSchoolPage() {
  const { schoolId } = Route.useParams();
  const navigate = useNavigate();
  const { schools, updateSchool, isLoading } = useSchoolsStore();

  const school = schools.find((s) => s.id === schoolId);

  if (!school) {
    return <div className="p-8 text-center text-red-500">School not found.</div>;
  }

  const handleSubmit = async (
    data: any,
    imageFile?: File,
    logoFile?: File,
    galleryFiles?: File[],
  ) => {
    try {
      await updateSchool(school.id, data, imageFile, logoFile, galleryFiles);
      toast.success("School updated successfully");
      navigate({ to: "/admin/schools" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update school");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6 overflow-hidden">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Edit School: {school.name}
        </h1>
        <p className="text-slate-500 mt-2">Update the details for this school.</p>
      </div>
      <SchoolForm initialData={school} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
