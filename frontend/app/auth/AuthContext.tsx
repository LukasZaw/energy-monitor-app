import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";
import { saveToken, getToken, removeToken } from './tokenUtils';
import { fetchCurrentUser } from '~/lib/axios';

type User = {
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

interface DecodedToken {
  sub: string;
  role?: string;
  authorities?: string[];
  [key: string]: any;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(getToken());
  const [username, setUsername] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        saveToken(token);

        fetchCurrentUser().then((userData) => {
            setUser({
            name: userData.name,
            email: userData.email,
            role: userData.role,
            });
        });
      } catch (err) {
        console.error('Błąd dekodowania tokena:', err, token);
        setUser(null);
        removeToken();
      }
    } else {
      setUser(null);
      removeToken();
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};