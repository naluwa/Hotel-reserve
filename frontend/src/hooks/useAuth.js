import { useState } from "react";
import { LOCAL_STORAGE_KEYS, TOAST_TYPES } from "../config/constants";
import { loginUser, registerCustomer } from "../services/api";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const validateAdminRole = (roles) => roles.includes("ROLE_ADMIN");

const persistSession = (token, email, fullName, role) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.JWT_TOKEN, token);
  localStorage.setItem(LOCAL_STORAGE_KEYS.USER_EMAIL, email);
  localStorage.setItem(LOCAL_STORAGE_KEYS.USER_FULL_NAME, fullName);
  localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ROLE, role);
};

const clearSession = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.JWT_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_EMAIL);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_FULL_NAME);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_ROLE);
};

export function useAuth(showToast) {
  const storedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.JWT_TOKEN) || "";

  const [token, setToken] = useState(() => storedToken);
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_KEYS.USER_EMAIL) || "",
  );
  const [userFullName, setUserFullName] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_KEYS.USER_FULL_NAME) || "",
  );
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ROLE) || "",
  );

  const applySession = (token, email, fullName, role) => {
    persistSession(token, email, fullName, role);
    setToken(token);
    setUserEmail(email);
    setUserFullName(fullName);
    setUserRole(role);
  };

  const handleLogin = async (email, password, requireAdmin, onSuccess) => {
    try {
      const data = await loginUser(email, password);
      const role = data.role || "";
      if (requireAdmin && role !== "ROLE_ADMIN") {
        throw new Error("Access denied. Admin privileges required.");
      }
      applySession(
        data.token,
        data.username || email,
        data.fullName || email,
        role,
      );
      showToast(
        `Welcome back, ${data.fullName || data.username || email}.`,
        TOAST_TYPES.SUCCESS,
      );
      onSuccess?.();
    } catch (err) {
      showToast(err.message, TOAST_TYPES.ERROR);
    }
  };

  const handleCustomerRegister = async (
    fullName,
    email,
    password,
    nicPassport,
    phone,
    address,
  ) => {
    try {
      const response = await registerCustomer(
        fullName,
        email,
        password,
        nicPassport,
        phone,
        address,
      );
      showToast("Account created successfully.", TOAST_TYPES.SUCCESS);
      return response;
    } catch (err) {
      showToast(err.message, TOAST_TYPES.ERROR);
      return null;
    }
  };

  const handleLogout = (onSuccess) => {
    clearSession();
    setToken("");
    setUserEmail("");
    setUserFullName("");
    setUserRole("");
    showToast("You have been signed out.", TOAST_TYPES.INFO);
    onSuccess?.();
  };

  return {
    token,
    userEmail,
    userFullName,
    userRole,
    isAdmin: validateAdminRole(userRole),
    isCustomer: userRole.includes("ROLE_CUSTOMER"),
    handleAdminLogin: (email, password, onSuccess) =>
      handleLogin(email, password, true, onSuccess),
    handleCustomerLogin: (email, password, onSuccess) =>
      handleLogin(email, password, false, onSuccess),
    handleCustomerRegister,
    handleLogout,
  };
}
