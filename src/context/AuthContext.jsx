import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken, removeAuthToken } from "../lib/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedToken = localStorage.getItem("token");
    if (storedToken) setAuthToken(storedToken);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  // Get all registered users
  const getAllUsers = () => {
    const usersStr = localStorage.getItem("registeredUsers");
    return usersStr ? JSON.parse(usersStr) : [];
  };

  // Save all users
  const saveAllUsers = (users) => {
    localStorage.setItem("registeredUsers", JSON.stringify(users));
  };

  // keep currentUser in sync
  useEffect(() => {
    if (user) localStorage.setItem("currentUser", JSON.stringify(user));
    else localStorage.removeItem("currentUser");
  }, [user]);

  // signup
  const signup = async (email, username, password, userType = "user") => {
    const users = getAllUsers();
    const emailExists = users.some((u) => u.email === email);
    const usernameExists = users.some((u) => u.username === username);

    if (emailExists) throw new Error("Email already exists.");
    if (usernameExists) throw new Error("Username already exists.");

    try {
      const resp = await api.post(`/api/auth/signup`, {
        email,
        username,
        password,
        userType,
      });
      const respUser = resp.data.user || { email, username, password, userType };
      const token = resp.data.token || `mock-token-${Date.now()}`;
      users.push({ email, username, password, userType });
      saveAllUsers(users);

      localStorage.setItem("token", token);
      setAuthToken(token);
      setUser({ ...respUser, token });
    } catch (err) {
      const mockToken = `mock-token-${Date.now()}`;
      const newUser = { email, username, password, userType, token: mockToken };
      users.push({ email, username, password, userType });
      saveAllUsers(users);

      localStorage.setItem("token", mockToken);
      setAuthToken(mockToken);
      setUser(newUser);
    }

    navigate(userType === "admin" ? "/admin/dashboard" : "/dashboard");
  };

  // login
  const login = async (credential, password, userType = "user") => {
    const users = getAllUsers();
    const matchedUser = users.find(
      (u) =>
        (u.email === credential || u.username === credential) &&
        u.password === password &&
        u.userType === userType
    );
    if (!matchedUser) throw new Error("Invalid credentials or user type.");

    try {
      const resp = await api.post(`/api/auth/login`, { credential, password, userType });
      const respUser = resp.data.user || matchedUser;
      const token = resp.data.token || `mock-token-${Date.now()}`;
      localStorage.setItem("token", token);
      setAuthToken(token);
      setUser({ ...respUser, token });
    } catch {
      const mockToken = `mock-token-${Date.now()}`;
      const newUser = { ...matchedUser, token: mockToken };
      localStorage.setItem("token", mockToken);
      setAuthToken(mockToken);
      setUser(newUser);
    }

    navigate(userType === "admin" ? "/admin/dashboard" : "/dashboard");
  };

  // logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    removeAuthToken();
    navigate("/login");
  };

  // check existing credentials
  const checkCredentialExists = (credential) => {
    const users = getAllUsers();
    return users.some(
      (u) => u.email === credential || u.username === credential
    );
  };

  // **New: update user data**
  const updateUser = (updates) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...updates };
      
      // Update the registeredUsers array too
      const users = getAllUsers();
      const idx = users.findIndex(u => u.username === prev.username);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        saveAllUsers(users);
      }

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        updateUser, // expose updateUser
        isAuthenticated: () => !!user,
        isAdmin: () => user?.userType === "admin",
        checkCredentialExists,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
