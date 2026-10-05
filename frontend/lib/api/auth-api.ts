import { apiClient } from "./client";
import { ApiResponse } from "@/types/api";
import { AuthResponse, UserProfileResponse } from "@/types/auth";

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export const authApi = {
  login: async (credentials: { username: string; password: string }): Promise<ApiResponse<AuthResponse>> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", credentials);
    if (res.data?.accessToken) {
      apiClient.setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/refresh", { refreshToken });
    if (res.data?.accessToken) {
      apiClient.setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res;
  },

  logout: async (): Promise<void> => {
    const refreshToken = apiClient.getRefreshToken();
    try {
      if (refreshToken) {
        await apiClient.post("/auth/logout", { refreshToken });
      }
    } catch {
      // Ignore network errors on logout to guarantee clean local state
    } finally {
      apiClient.clearTokens();
    }
  },

  getMe: async (): Promise<ApiResponse<UserProfileResponse>> => {
    return apiClient.get<ApiResponse<UserProfileResponse>>("/auth/me");
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>("/auth/change-password", payload);
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>("/auth/forgot-password", payload);
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>("/auth/reset-password", payload);
  },

  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", payload);
    if (res.data?.accessToken) {
      apiClient.setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res;
  },
};
