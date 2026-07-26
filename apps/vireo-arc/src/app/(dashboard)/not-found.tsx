import Link from "next/link";
import { Button, Card, CardContent } from "@cardioline/ui";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md border-gray-200 bg-white shadow-sm">
        <CardContent className="space-y-4 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            404
          </p>
          <h1 className="text-xl font-bold text-[#071046]">Page not found</h1>
          <p className="text-sm text-gray-500">
            The record you are looking for does not exist or may have been
            removed.
          </p>
          <Button asChild className="bg-primary text-white">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
