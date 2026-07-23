import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../services/api";

const AuthContext = createContext(null);

const LOCAL_STORAGE_TOKEN = "hotel_admin_token";
const LOCAL_STORAGE_USER = "hotel_admin_username";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_TOKEN) || "",
  );
  const [username, setUsername] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_USER) || "",
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    }
  }, [token]);

  useEffect(() => {
    if (username) {
      localStorage.setItem(LOCAL_STORAGE_USER, username);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER);
    }
  }, [username]);

  const handleLogin = async (usernameValue, password) => {
    const data = await loginUser(usernameValue, password);
    setToken(data.token);
    setUsername(data.username);
  };

  const handleLogout = () => {
    setToken("");
    setUsername("");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        handleLogin,
        handleLogout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
