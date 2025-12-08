import React from "react";
import { Navigate } from "react-router-dom";

const ProtectAdminAndCashier = ({ children, role }) => {
       

  const userRole = localStorage.getItem("role"); // "admin" or "cashier"
   localStorage.setItem("role", user.role);
  if (!userRole) {
    return <Navigate to="/" replace />; // not logged in
  }

  if (userRole !== role) {
    return <Navigate to="/" replace />; // wrong role
  }

  return children;
};

export default ProtectAdminAndCashier;
