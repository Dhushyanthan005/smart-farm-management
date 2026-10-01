import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance & Ledgers"
        description="Operational expenses, revenue streams, accounts ledger, and farm P&L accounting."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Record Transaction
        </Button>
      </PageHeader>

      <EmptyState
        title="No finance records found"
        description="Records for finance & ledgers will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Record Transaction
          </Button>
        }
      />
    </div>
  );
}
