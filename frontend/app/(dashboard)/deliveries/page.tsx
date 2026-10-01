import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DeliveriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Logistics"
        description="Route dispatching, driver assignments, delivery completion, and real-time tracking."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Dispatch Route
        </Button>
      </PageHeader>

      <EmptyState
        title="No deliveries records found"
        description="Records for delivery logistics will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Dispatch Route
          </Button>
        }
      />
    </div>
  );
}
