import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SchoolForm } from "@/components/admin/SchoolForm";
import { useSchoolsStore } from "@/data/useSchoolsStore";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/schools/new")({
  component: AddSchoolPage,
});

function AddSchoolPage() {
  const navigate = useNavigate();
  const { addSchool, isLoading } = useSchoolsStore();

  const handleSubmit = async (
    data: any,
    imageFile?: File,
    logoFile?: File,
    galleryFiles?: File[],
  ) => {
    try {
      await addSchool(data, imageFile, logoFile, galleryFiles);
      toast.success("School added successfully");
      navigate({ to: "/admin/schools" });
    } catch (error: any) {
      if (error.code === "23505") {
        // Postgres unique violation code
        toast.error("A school with this ID already exists");
      } else {
        toast.error(error.message || "Failed to add school");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New School</h1>
        <p className="text-slate-500 mt-2">
          Fill in the details below to add a new school to the system.
        </p>
      </div>
      <SchoolForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
