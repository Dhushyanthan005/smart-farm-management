import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed border-[#E2E5DF] bg-white">
      <div className="w-12 h-12 rounded-full bg-[#F4F5F0] flex items-center justify-center text-[#4D6A42] mb-4">
        <FolderOpen className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#1F2421]">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mt-1 mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
