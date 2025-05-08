import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("admin");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (emailOrUsername, password) => {
    // Hardcoded demo credentials
    const validCredentials = {
      email: "admin@example.com",
      username: "admin",
      password: "admin123",
    };

    if (
      (emailOrUsername === validCredentials.email ||
        emailOrUsername === validCredentials.username) &&
      password === validCredentials.password
    ) {
      const adminUser = {
        id: 1,
        name: "Admin",
        isAdmin: true,
      };
      localStorage.setItem("admin", JSON.stringify(adminUser));
      setUser(adminUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("admin");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
