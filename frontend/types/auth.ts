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
  roles: Role[];
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: string;
  username: string;
  email: string;
  roles: Role[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
