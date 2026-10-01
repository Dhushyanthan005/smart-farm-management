import { apiClient } from "./client";
import { ApiResponse } from "@/types/api";
import { AuthResponse } from "@/types/auth";

export const authApi = {
  login: async (credentials: { username: string; password: string }): Promise<ApiResponse<AuthResponse>> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", credentials);
    if (res.data?.accessToken) {
      apiClient.setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res;
  },

  refreshToken: (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<ApiResponse<AuthResponse>>("/auth/refresh-token", { refreshToken });
  },

  logout: async (): Promise<void> => {
    apiClient.clearTokens();
  },
};
