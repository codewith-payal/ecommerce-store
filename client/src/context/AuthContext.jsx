import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = 'http://localhost:5000/api/users';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const saveUser = (data) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/login`, { email, password });
    saveUser(data);
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/register`, { name, email, password });
    saveUser(data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}