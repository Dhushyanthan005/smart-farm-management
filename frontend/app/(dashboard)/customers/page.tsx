import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Management"
        description="Retail and wholesale customer directory, delivery addresses, and contact records."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Customer
        </Button>
      </PageHeader>

      <EmptyState
        title="No customers records found"
        description="Records for customer management will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Customer
          </Button>
        }
      />
    </div>
  );
}
