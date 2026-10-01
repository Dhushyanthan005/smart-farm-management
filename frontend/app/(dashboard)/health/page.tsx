import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Veterinary Health Records"
        description="Medical examinations, diagnoses, clinical treatments, and prescription logs."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Record Health Check
        </Button>
      </PageHeader>

      <EmptyState
        title="No health records found"
        description="Records for veterinary health records will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Record Health Check
          </Button>
        }
      />
    </div>
  );
}
