import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("admin");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (emailOrUsername, password) => {
    try {
      const response = await axios.post("/api/v1/admin/login", {
        emailOrUsername,
        password,
      });

      if (response.data.success) {
        const adminUser = {
          id: response.data.user.id,
          name: response.data.user.name,
          isAdmin: true,
        };
        localStorage.setItem("admin", JSON.stringify(adminUser));
        setUser(adminUser);
        return true;
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
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
