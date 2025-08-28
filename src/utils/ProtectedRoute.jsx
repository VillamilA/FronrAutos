import React from "react";
import { useSelector } from "react-redux";
import MustLogin from "../pages/MustLogin.jsx";
import Forbidden404 from "../pages/Forbidden404.jsx";
import { useLocation } from "react-router-dom";

// roles: string[] (opcional) - si se pasa, solo esos roles pueden acceder
export default function ProtectedRoute({ children, roles }) {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!token || !user) {
    return <MustLogin />;
  }

  // Si se especifican roles, validar el rol
  if (roles && !roles.includes(user.rol)) {
    // Mostrar página 404 personalizada si el usuario no tiene permiso
    return <Forbidden404 />;
  }

  return children;
}
