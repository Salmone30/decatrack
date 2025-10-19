import { Server } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="p-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
          <Server className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">No Servers Configured</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            No Minecraft servers are currently being tracked. 
            Configure servers in the backend to start monitoring.
          </p>
        </div>
      </div>
    </Card>
  );
}
