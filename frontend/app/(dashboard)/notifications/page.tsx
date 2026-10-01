import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Alerts"
        description="System alerts, overdue health reminders, stock warnings, and messaging logs."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </PageHeader>

      <EmptyState
        title="No notifications records found"
        description="Records for notifications & alerts will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        }
      />
    </div>
  );
}
