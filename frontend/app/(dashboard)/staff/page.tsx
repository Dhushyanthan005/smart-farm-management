import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Management"
        description="Worker directory, veterinary shifts, daily attendance, and role permissions."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </PageHeader>

      <EmptyState
        title="No staff records found"
        description="Records for staff management will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Staff Member
          </Button>
        }
      />
    </div>
  );
}
