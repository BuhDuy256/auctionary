import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-destructive/30 rounded-lg bg-destructive/5">
      <div className="p-4 rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <p className="text-destructive text-sm mb-4">{message}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="border-destructive/50 text-destructive hover:bg-destructive/10"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </Button>
    </div>
  );
}
