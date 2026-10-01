import React from "react";
import { Cow } from "@/types/cow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDate } from "@/lib/utils/format";

export function CowCard({ cow }: { cow: Cow }) {
  return (
    <Card className="hover:border-[#1E3A2F] transition-all cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{cow.tagNumber}</CardTitle>
          <StatusBadge status={cow.status} />
        </div>
        {cow.name && <p className="text-xs text-gray-500 font-medium">{cow.name}</p>}
      </CardHeader>
      <CardContent className="text-xs text-gray-600 space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">Breed:</span>
          <span className="font-medium text-[#1F2421]">{cow.breed}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Gender:</span>
          <span>{cow.gender}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">DOB:</span>
          <span>{formatDate(cow.dateOfBirth)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
