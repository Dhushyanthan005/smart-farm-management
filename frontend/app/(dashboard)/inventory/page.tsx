import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Farm Inventory"
        description="Feed stock, veterinary medications, farm supplies, and automated reorder alerts."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Inventory Item
        </Button>
      </PageHeader>

      <EmptyState
        title="No inventory records found"
        description="Records for farm inventory will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Inventory Item
          </Button>
        }
      />
    </div>
  );
}
