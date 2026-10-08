'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { User } from '../types';

interface StoredUser {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'NGO' | 'Volunteer';
}

interface AuthContextType {
  user: StoredUser | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<StoredUser | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const login = (userData: User) => {
    const safeUser: StoredUser = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };
    localStorage.setItem('user', JSON.stringify(safeUser));
    setUser(safeUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;