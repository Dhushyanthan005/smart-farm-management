import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={cn("w-6 h-6 animate-spin text-[#1E3A2F]", className)} />
    </div>
  );
}
