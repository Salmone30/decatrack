import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card className="p-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            {message}
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" data-testid="button-retry">
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
