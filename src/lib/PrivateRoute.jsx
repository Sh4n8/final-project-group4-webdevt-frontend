import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const matches = allowedRoles.includes(user.userType);
    if (!matches) {
      // logged in but not allowed
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
