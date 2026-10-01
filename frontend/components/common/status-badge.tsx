import React from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case "ACTIVE":
    case "LACTATING":
    case "DELIVERED":
    case "CONFIRMED":
    case "RECOVERED":
      return <Badge variant="success">{status}</Badge>;
    case "PREGNANT":
    case "PENDING":
    case "INSEMINATED":
      return <Badge variant="warning">{status}</Badge>;
    case "SICK":
    case "CANCELLED":
    case "DECEASED":
    case "FAILED":
      return <Badge variant="danger">{status}</Badge>;
    case "DRY":
    case "SOLD":
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
