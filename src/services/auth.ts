import api from "@/lib/axios";

import type {
  LoginFormData,
  LoginResponseData,
} from "@/types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const login = async (
  payload: LoginFormData
): Promise<LoginResponseData> => {
  const response = await api.post<
    ApiResponse<LoginResponseData>
  >("/auth/login", {
    email: payload.email.trim(),
    password: payload.password,
  });

  return response.data.data;
};