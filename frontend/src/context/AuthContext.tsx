import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';
import { IUser, IAuthState } from '../types';

interface IAuthContextType extends IAuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<IAuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // Crucial for preventing route flashes on refresh
  });

  // Re-establish session on startup/refresh
  useEffect(() => {
    const bootstrapAuth = () => {
      try {
        const storedToken = localStorage.getItem('gigflow_token');
        const storedUser = localStorage.getItem('gigflow_user');

        if (storedToken && storedUser) {
          setState({
            user: JSON.parse(storedUser) as IUser,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Failed to parse stored session:', error);
        logout();
      }
    };

    bootstrapAuth();
  }, []);

  /**
   * 🔑 Login Action
   */
  const login = async (email: string, password: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, data } = response.data;
      const user = data.user as IUser;

      // Persist in localStorage
      localStorage.setItem('gigflow_token', token);
      localStorage.setItem('gigflow_user', JSON.stringify(user));

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your inputs.';
      throw new Error(errorMsg);
    }
  };

  /**
   * ➕ Register Action
   */
  const register = async (
    name: string,
    email: string,
    password: string,
    role?: string
  ): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { token, data } = response.data;
      const user = data.user as IUser;

      // Persist in localStorage
      localStorage.setItem('gigflow_token', token);
      localStorage.setItem('gigflow_user', JSON.stringify(user));

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));
      const errorMsg = error.response?.data?.message || 'Registration failed. Please check your inputs.';
      throw new Error(errorMsg);
    }
  };

  /**
   * ❌ Logout Action
   */
  const logout = () => {
    localStorage.removeItem('gigflow_token');
    localStorage.removeItem('gigflow_user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom React Hook to consume Auth state
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be consumed within an AuthProvider');
  }
  return context;
};
