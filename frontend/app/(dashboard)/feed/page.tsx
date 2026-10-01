import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Feed & Nutrition"
        description="Ration formulations, daily consumption tracking, and nutritional intake cost analysis."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Log Feed Consumption
        </Button>
      </PageHeader>

      <EmptyState
        title="No feed records found"
        description="Records for feed & nutrition will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Log Feed Consumption
          </Button>
        }
      />
    </div>
  );
}
