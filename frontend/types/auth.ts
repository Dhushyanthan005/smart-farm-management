export type Role =
  | "ROLE_OWNER"
  | "ROLE_ADMIN"
  | "ROLE_MANAGER"
  | "ROLE_VETERINARIAN"
  | "ROLE_WORKER"
  | "ROLE_DELIVERY_STAFF"
  | "ROLE_CUSTOMER";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  roles: Role[];
  permissions: string[];
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
}

export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  status: string;
  roles: Role[];
  permissions: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn?: number;
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: Role[];
  permissions?: string[];
  user?: UserProfileResponse;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
