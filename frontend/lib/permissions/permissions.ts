import { Role, User } from "@/types/auth";

export function hasRole(user: User | null, allowedRoles: Role[]): boolean {
  if (!user || !user.roles) return false;
  if (user.roles.includes("ROLE_OWNER") || user.roles.includes("ROLE_ADMIN")) return true;
  return allowedRoles.some((role) => user.roles.includes(role));
}

export function canAccessModule(user: User | null, requiredRole?: Role): boolean {
  if (!requiredRole) return true;
  return hasRole(user, [requiredRole]);
}
