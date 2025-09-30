import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Fetch user profile on token change
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error("Auth fetchUser error:", err);
        setUser(null);
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  // Log in helper
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(userData);
  };

  // Log out helper
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <authContext.Provider value={{ user, setUser, token, setToken, loading, login, logout }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
