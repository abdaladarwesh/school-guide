import { AppShell } from "./AppShell";
import { Skeleton } from "./ui/skeleton";

export function ScaffoldLoading() {
  return (
    <AppShell>
      <div className="flex flex-col space-y-6 px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="space-y-4 pt-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    </AppShell>
  );
}
