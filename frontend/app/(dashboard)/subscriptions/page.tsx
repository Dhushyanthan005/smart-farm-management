import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Milk Subscriptions"
        description="Recurring daily/alternate delivery plans, pauses, vacation holds, and plan renewals."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Subscription
        </Button>
      </PageHeader>

      <EmptyState
        title="No subscriptions records found"
        description="Records for milk subscriptions will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Subscription
          </Button>
        }
      />
    </div>
  );
}
