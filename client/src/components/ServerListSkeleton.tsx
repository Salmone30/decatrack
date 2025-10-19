import { Card } from "@/components/ui/card";

export function ServerListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-muted rounded-md animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
              <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              <div className="h-2 w-full bg-muted rounded animate-pulse" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
