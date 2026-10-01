import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function BreedingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Breeding & Insemination"
        description="Heat cycle detection, artificial insemination (AI) records, pregnancy checks, and calving."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Record Insemination
        </Button>
      </PageHeader>

      <EmptyState
        title="No breeding records found"
        description="Records for breeding & insemination will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Record Insemination
          </Button>
        }
      />
    </div>
  );
}
