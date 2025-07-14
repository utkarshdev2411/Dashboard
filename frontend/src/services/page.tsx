// src/services/auth.service.ts
import axios, { AxiosError } from 'axios';

const BASE_ORIGIN = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const BASE_URL = `${BASE_ORIGIN}/api`;

interface LoginData {
  email: string;
}

interface SignupData {
  name: string;
  email: string;
}

interface OtpPayload {
  email: string;
  otp: string;
}

// Optional generic type for API response structure
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  token?: string; // <- optional
}

// Helper functions with generic typing
const safePost = async <T = any>(url: string, data?: any): Promise<T> => {
  try {
    const res = await axios.post<T>(`${BASE_URL}${url}`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    throw error.response?.data || { message: error.message };
  }
};

const safeGet = async <T = any>(url: string): Promise<T> => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await axios.get<T>(`${BASE_URL}${url}`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    throw error.response?.data || { message: error.message };
  }
};

// Public API functions
export const login = async (data: LoginData) =>
  await safePost<ApiResponse<null>>('/login', data);

export const signup = async (data: SignupData) =>
  await safePost<ApiResponse<null>>('/signup', data);

export const verifyOtp = async (data: OtpPayload) =>
  await safePost<ApiResponse<{ token: string }>>('/verify-otp', data);

export const resendOtp = async (email: string) =>
  await safePost<ApiResponse<null>>('/resend-otp', { email });

export const getProfile = async () =>
  await safeGet<{ user: any }>('/get-profile');
