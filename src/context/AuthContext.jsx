import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('admin');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (password) => {
    if (password === 'admin123') { // Hardcoded demo password
      const adminUser = { 
        id: 1, 
        name: 'Admin',
        isAdmin: true
      };
      localStorage.setItem('admin', JSON.stringify(adminUser));
      setUser(adminUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
