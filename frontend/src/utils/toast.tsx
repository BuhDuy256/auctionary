import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { RotateCcw, X } from "lucide-react";

const baseStyle = {
  background: "#15161b",
  color: "#d1d5db",
  border: "1px solid #333333",
  padding: "8px 10px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
  maxWidth: "400px",
};

export const notify = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        ...baseStyle,
        borderLeft: "4px solid #00c950",
        boxShadow:
          "0 10px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(0,201,80,0.2)",
      },
      iconTheme: {
        primary: "#00c950",
        secondary: "#15161b",
      },
    }),

  error: (message: string) =>
    toast.error(message, {
      style: {
        ...baseStyle,
        borderLeft: "4px solid #ef4444",
        boxShadow:
          "0 10px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(239,68,68,0.2)",
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#15161b",
      },
    }),

  undo: (message: string, onUndo: () => void) =>
    toast(
      (t) => (
        <div className="flex items-center justify-between w-full gap-4 min-w-[240px]">
          <span className="text-sm font-medium">{message}</span>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                onUndo();
                toast.dismiss(t.id);
              }}
              className="h-7 px-3 text-xs border-white/10 hover:bg-white/10"
            >
              <RotateCcw className="mr-1.5 h-3 w-3" />
              Undo
            </Button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ),
      {
        duration: 4000,
        style: {
          ...baseStyle,
          borderLeft: "4px solid #3b82f6",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8)",
        },
      }
    ),
};
