import { cn } from "@cardioline/ui";

/** Pulse placeholder shown while the prototype store hydrates from localStorage. */
export function RecordSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)} aria-busy="true" aria-label="Loading record">
      <div className="h-9 w-64 animate-pulse rounded-md bg-gray-100" />
      <div className="h-40 animate-pulse rounded-lg border border-gray-100 bg-gray-50" />
      <div className="h-72 animate-pulse rounded-lg border border-gray-100 bg-gray-50" />
    </div>
  );
}
