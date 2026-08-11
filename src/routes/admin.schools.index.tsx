import { createFileRoute } from "@tanstack/react-router";
import { SchoolsDataTable } from "@/components/admin/SchoolsDataTable";

export const Route = createFileRoute("/admin/schools/")({
  component: AdminSchoolsPage,
});

function AdminSchoolsPage() {
  return <SchoolsDataTable />;
}
