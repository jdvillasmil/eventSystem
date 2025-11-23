// src/routes/AuthRoutes.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RouteProps {
  children: React.ReactElement;
}

export const PrivateRoute: React.FC<RouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="fullpage-center">Verificando sesion...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const PublicRoute: React.FC<RouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="fullpage-center">Verificando sesion...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
