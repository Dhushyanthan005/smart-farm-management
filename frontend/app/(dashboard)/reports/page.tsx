import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Production aggregations, herd health reports, financial sheets, and CSV/PDF exports."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </PageHeader>

      <EmptyState
        title="No reports records found"
        description="Records for reports & analytics will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        }
      />
    </div>
  );
}
