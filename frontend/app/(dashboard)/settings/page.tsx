import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Farm Settings"
        description="Farm profile, operating hours, milk pricing, security settings, and module toggles."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </PageHeader>

      <EmptyState
        title="No settings records found"
        description="Records for farm settings will appear here as entries are logged."
        action={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        }
      />
    </div>
  );
}
