import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function MilkPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Milk Production"
        description="Daily morning and evening milk collection logs, yield tracking, and quality testing."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Log Collection
        </Button>
      </PageHeader>

      <EmptyState
        title="No milk collections recorded today"
        description="Log morning or evening session yields to track dairy productivity metrics."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Log Collection
          </Button>
        }
      />
    </div>
  );
}
