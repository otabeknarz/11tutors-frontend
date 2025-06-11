import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, REFRESH_URL, REGISTER_URL, LOGIN_URL, USER_INFO_URL } from './constants';

// Helper function to get the access token from localStorage
const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

/**
 * Helper function to refresh the access token using the refresh token
 * @returns Promise with the new access token or null if refresh failed
 */
const refreshTokenInternal = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return null;
    }
    
    const response = await axios.post(REFRESH_URL, {
      refresh: refreshToken
    });
    
    const { access } = response.data;
    
    // Save the new access token
    localStorage.setItem('accessToken', access);
    
    return access;
  } catch (error) {
    // If refresh token is invalid, clear all tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return null;
  }
};

// Create axios instance with custom configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add the Authorization header with JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    
    // Only attach token if it exists
    if (token) {
      // Set the Authorization header properly
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Only allow specific HTTP methods
    if (config.method && !['get', 'post', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      throw new Error(`HTTP method ${config.method} is not supported`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (
      error.response?.status === 401 &&
      originalRequest && 
      !(originalRequest as any)._retry
    ) {
      (originalRequest as any)._retry = true;
      
      // Try to refresh the token
      const newToken = await refreshTokenInternal();
      
      if (newToken) {
        // Retry the original request with the new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      }
      
      // If token refresh failed, redirect to login page
      if (typeof window !== 'undefined') {
        // You can implement a redirect to login page here
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Register a new user with the application
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise with the API response or error
 */
export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  try {
    const response = await api.post(REGISTER_URL, {
      first_name: firstName,
      last_name: lastName,
      email,
      password
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
};

/**
 * Login a user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise with the login result
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post(LOGIN_URL, {
      email,
      password
    });
    
    const { access, refresh } = response.data;
    
    // Store tokens in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
    }
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
};

/**
 * Refresh the access token using the refresh token stored in localStorage
 * @returns Promise with the result of the refresh operation
 */
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token found'
      };
    }
    
    const response = await api.post(REFRESH_URL, {
      refresh: refreshToken
    });
    
    const { access } = response.data;
    
    // Save the new access token
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', access);
    }
    
    return {
      success: true,
      data: { access }
    };
  } catch (error) {
    // If refresh token is invalid, clear all tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
};

/**
 * Get the current user's information
 * @returns Promise with user data or error
 */
export const getUser = async () => {
  try {
    // First attempt to get user info
    const response = await api.get(USER_INFO_URL);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    // Check if it's a 401 error
    if (error instanceof AxiosError && error.response?.status === 401) {
      // Try to refresh the token
      const refreshResult = await refreshToken();
      
      if (refreshResult.success) {
        try {
          // Retry the request with the new token
          const response = await api.get(USER_INFO_URL);
          return {
            success: true,
            data: response.data
          };
        } catch (retryError) {
          // If retry fails, return the error
          if (retryError instanceof AxiosError) {
            return {
              success: false,
              error: retryError.response?.data || retryError.message
            };
          }
        }
      }
      
      // If token refresh failed
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
    
    // Handle other types of errors
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
};

/**
 * Update the current user's information
 * @param userData - Object containing the user fields to update
 * @returns Promise with updated user data or error
 */
export const updateUser = async (userData: {
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  [key: string]: any; // Allow other fields
}) => {
  try {
    const response = await api.patch(USER_INFO_URL, userData);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
};

/**
 * Log out the current user by clearing tokens and redirecting to login page
 * @param redirectToLogin - Whether to redirect to login page (default: true)
 */
export const logoutUser = (redirectToLogin: boolean = true): void => {
  // Only run in browser environment
  if (typeof window !== 'undefined') {
    // Clear authentication tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Redirect to login page if specified
    if (redirectToLogin) {
      window.location.href = '/login';
    }
  }
};

export default api;
