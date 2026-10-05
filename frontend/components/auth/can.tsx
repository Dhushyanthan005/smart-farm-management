"use client";

import React from "react";
import { Role } from "@/types/auth";
import { useAuth } from "@/providers/auth-provider";

interface CanProps {
  permission?: string | string[];
  role?: Role | Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Can({ permission, role, fallback = null, children }: CanProps) {
  const { hasPermission, hasRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  let roleAllowed = true;
  if (role) {
    roleAllowed = hasRole(role);
  }

  let permissionAllowed = true;
  if (permission) {
    permissionAllowed = hasPermission(permission);
  }

  if (roleAllowed && permissionAllowed) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
