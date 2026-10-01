import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders & Sales"
        description="Direct sales orders, daily delivery manifests, and fulfillment statuses."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Order
        </Button>
      </PageHeader>

      <EmptyState
        title="No orders records found"
        description="Records for orders & sales will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Order
          </Button>
        }
      />
    </div>
  );
}
