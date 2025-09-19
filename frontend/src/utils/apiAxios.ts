import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { logOut } from "../features/user/services/AuthServices";
import { logout } from "../features/auth/auth.slice";
import { store } from "../store/store";
import toast from "react-hot-toast";

// Backend base URL
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

// Create universal Axios instance
const apiAxios: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ✅ Request Interceptor
apiAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can dynamically set headers here if needed
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ✅ Response Interceptor
apiAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) return Promise.reject(error);

    // 401: Unauthorized → try refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.get(`${API_BASE_URL}/api/auth/refresh`, {
          withCredentials: true,
        });
        return apiAxios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        toast.error("Session expired. Redirecting to login.");
        await logOut();
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 403: Forbidden → blocked user
    if (error.response?.status === 403) {
      toast.error("Access denied. Redirecting to login.");
      await logOut();
      store.dispatch(logout());
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
export default apiAxios;
