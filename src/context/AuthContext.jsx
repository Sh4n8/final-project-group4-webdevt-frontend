// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, {
  setAuthToken,
  removeAuthToken,
  registerUser,
  loginUser,
  getProfile,
  checkCredential,
} from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      getProfile()
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  const signup = async (email, username, password, userType = "user") => {
    const res = await registerUser({
      name: username,
      email,
      password,
      userType,
    });

    const { token, ...u } = res.data;
    localStorage.setItem("token", token);
    setAuthToken(token);
    setUser(u);
    navigate(userType === "admin" ? "/admin" : "/dashboard");
  };

  const login = async (credential, password, userType = "user") => {
    const res = await loginUser({ email: credential, password, userType });
    const { token, ...u } = res.data;
    localStorage.setItem("token", token);
    setAuthToken(token);
    setUser(u);
    navigate(userType === "admin" ? "/admin" : "/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    removeAuthToken();
    navigate("/login");
  };

  const checkCredentialExists = async (c) => {
    if (!c) return false;
    try {
      const r = await checkCredential(c);
      return r.data.exists;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        checkCredentialExists,
        isAuthenticated: () => !!user,
        isAdmin: () => user?.userType === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthContext;
