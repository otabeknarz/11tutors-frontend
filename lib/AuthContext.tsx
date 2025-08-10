'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, logoutUser, getUser, updateUser } from './api';

// Define the User type
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  [key: string]: any;
}

// Define the context value type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
  clearError: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUserProfile: async () => false,
  clearError: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Function to fetch the current user
  const fetchUser = async () => {
    if (isRefreshing) return;
    
    try {
      setLoading(true);
      const result = await getUser();
      
      if (result.success) {
        setUser(result.data);
        // Set current user ID for onboarding tracking
        if (typeof window !== 'undefined' && result.data?.id) {
          localStorage.setItem('currentUserId', result.data.id);
        }
      } else {
        setUser(null);
        // Clear current user ID if login failed
        if (typeof window !== 'undefined') {
          localStorage.removeItem('currentUserId');
        }
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check for user on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check if we have tokens in localStorage
      const hasToken = typeof window !== 'undefined' && localStorage.getItem('accessToken');
      
      if (hasToken) {
        await fetchUser();
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await loginUser(email, password);
      
      if (result.success) {
        await fetchUser();
        return true;
      } else {
        setError(typeof result.error === 'string' ? result.error : 'Login failed');
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await registerUser(firstName, lastName, email, password);
      
      if (result.success) {
        // After registration, log the user in
        return await login(email, password);
      } else {
        setError(typeof result.error === 'string' ? result.error : 'Registration failed');
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    // Clear current user ID and onboarding data on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('onboardingUserId');
      localStorage.removeItem('11tutors-onboarding');
    }
    logoutUser();
  };

  // Update user profile
  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateUser(userData);
      
      if (result.success) {
        setUser(prevUser => prevUser ? { ...prevUser, ...result.data } : result.data);
        return true;
      } else {
        setError(typeof result.error === 'string' ? result.error : 'Update failed');
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
