import axios, { InternalAxiosRequestConfig, AxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// SSR-safe interceptor (קריאת token מ־localStorage כגיבוי)
API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window === "undefined") return config;
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// פונקציה לניהול token ב־axios + localStorage
export const setAuthToken = (token: string | null) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
    try { if (typeof window !== "undefined") localStorage.setItem("token", token); } catch {}
  } else {
    delete API.defaults.headers.common.Authorization;
    try { if (typeof window !== "undefined") localStorage.removeItem("token"); } catch {}
  }
};

// פונקציה כללית לקריאות API
export const apiRequest = async <T>(
  url: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    config?: AxiosRequestConfig;
  } = {}
): Promise<T> => {
  const { method = "GET", body, config } = options;
  const axiosConfig: AxiosRequestConfig = { url, method, ...(config || {}) };
  if (method === "GET") axiosConfig.params = body;
  else axiosConfig.data = body;
  const resp = await API.request<T>(axiosConfig);
  return resp.data;
};

// פונקציות ספציפיות ל־auth (התאימי את שם ה־endpoint אם שונה)
export const loginWithPassword = async (email: string, password: string) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data; // מצפה למבנה: { status, success, user, token, expiresAt }
};

export const createOtp = async (contact: string) => {
  const { data } = await API.post("/auth/create-otp", { contact });
  return data;
};

export default API;