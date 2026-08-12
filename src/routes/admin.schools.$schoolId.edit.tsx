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
    <div className="w-full max-w-5xl mx-auto space-y-4 md:space-y-6 p-3 md:p-6 overflow-x-hidden">
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 break-words">
          Edit School: {school.name}
        </h1>
        <p className="text-sm md:text-base text-slate-500 mt-1 md:mt-2">
          Update the details for this school.
        </p>
      </div>
      <SchoolForm initialData={school} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
