import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const getToken = () => localStorage.getItem("token");
  return <>{getToken() ? <Outlet /> : <Navigate to="login" />}</>;
}

export default ProtectedRoute;
