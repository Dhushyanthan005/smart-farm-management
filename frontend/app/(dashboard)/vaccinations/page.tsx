import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function VaccinationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vaccination Management"
        description="Herd immunization schedules, dose tracking, batch numbers, and due alerts."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Vaccine
        </Button>
      </PageHeader>

      <EmptyState
        title="No vaccinations records found"
        description="Records for vaccination management will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Vaccine
          </Button>
        }
      />
    </div>
  );
}
