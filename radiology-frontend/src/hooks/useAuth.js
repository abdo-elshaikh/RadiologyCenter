import { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '../lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Parse JWT token to get user info
  const parseJwtToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    if (token) {
      const payload = parseJwtToken(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser({
          id: payload.nameid || payload.sub,
          username: payload.unique_name || payload.name,
          role: payload.role,
          fullName: payload.fullName,
        });
      } else {
        // Token expired
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password, rememberMe }) => {
      const response = await api.post(endpoints.auth.login, { username, password });
      return { ...response.data, rememberMe };
    },
    onSuccess: (data) => {
      const { token, rememberMe } = data;
      
      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem('auth_token', token);
        sessionStorage.removeItem('auth_token');
      } else {
        sessionStorage.setItem('auth_token', token);
        localStorage.removeItem('auth_token');
      }
      
      // Parse and set user
      const payload = parseJwtToken(token);
      if (payload) {
        setUser({
          id: payload.nameid || payload.sub,
          username: payload.unique_name || payload.name,
          role: payload.role,
          fullName: payload.fullName,
        });
      }
      
      toast.success('Login successful!');
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post(endpoints.auth.register, userData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed');
    },
  });

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    setUser(null);
    queryClient.clear();
    toast.success('Logged out successfully');
  };

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData) => {
      const response = await api.post(endpoints.auth.changePassword, passwordData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    changePassword: changePasswordMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isChangePasswordLoading: changePasswordMutation.isPending,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}