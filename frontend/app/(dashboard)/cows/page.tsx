"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CowCard } from "@/features/cows";
import { useCows } from "@/features/cows";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { EmptyState } from "@/components/common/empty-state";
import { Plus, Search } from "lucide-react";

export default function CowsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data, isLoading } = useCows(0, 20, statusFilter);

  const cows = data?.data?.content || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Herd Management"
        description="Comprehensive livestock registry, ear-tag tracking, and animal lifecycle management."
      >
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Register Cow
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search ear tag or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          {["ALL", "LACTATING", "DRY", "PREGNANT", "SICK"].map((status) => (
            <Button
              key={status}
              variant={(!statusFilter && status === "ALL") || statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status === "ALL" ? undefined : status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : cows.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cows.map((cow) => (
            <CowCard key={cow.id} cow={cow} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No cows registered yet"
          description="Begin by registering your first cow into the DairyFlow herd registry."
          action={
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Register Cow
            </Button>
          }
        />
      )}
    </div>
  );
}
