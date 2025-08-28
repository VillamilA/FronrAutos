import DashboardTecnico from "./pages/DashboardTecnico.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx"; 
import Dashboard from "./pages/Dashboard.jsx";
import DashboardCliente from "./pages/DashboardCliente.jsx";
import CrearReserva from "./pages/CrearReserva.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import TicketsAdmin from "./components/TicketsAdmin.jsx";
import AutosAdmin from "./components/AutosAdmin.jsx";
import TecnicosAdmin from "./components/TecnicosAdmin.jsx";
import ClientesAdmin from "./components/ClientesAdmin.jsx";
import NotificacionesAdmin from "./components/NotificacionesAdmin.jsx";
import PerfilAdmin from "./components/PerfilAdmin.jsx";
import AddTech from "./pages/AddTech.jsx";
import Clients from "./pages/Clients.jsx";
import ReservasCliente from "./components/TicketsCliente.jsx";
import PerfilCliente from "./components/PerfilCliente.jsx";
import VerificarCorreo from "./pages/VerificarCorreo";

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          {/* Redirect root path to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/cliente" element={
            <ProtectedRoute>
              <DashboardCliente />
            </ProtectedRoute>
          }>
            <Route path="reservas" element={<ReservasCliente />} />
            <Route path="crear-reserva" element={<CrearReserva />} />
            <Route path="perfil" element={<PerfilCliente />} />
          </Route>
          {/* Ruta de create-ticket eliminada porque el componente no existe */}
          <Route path="/dashboard/tecnico/*" element={
            <ProtectedRoute allowedRoles={["tecnico"]}>
              <DashboardTecnico />
            </ProtectedRoute>
          } />
          <Route path="/verificar-correo" element={<VerificarCorreo />} />
          {/* Admin dashboard and nested modules */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }>
            <Route path="reservas" element={<TicketsAdmin />} />
            <Route path="autos" element={<AutosAdmin />} />
            <Route path="clientes" element={<ClientesAdmin />} />
            <Route path="notificaciones" element={<NotificacionesAdmin />} />
            <Route path="perfil" element={<PerfilAdmin />} />
            {/* Formularios de creación desde admin */}
            <Route path="crear-tecnico" element={<AddTech />} />
            <Route path="crear-cliente" element={<Clients />} />
            {/* Ruta de crear-ticket eliminada porque el componente no existe */}
          </Route>
        </Routes>
      </Router>
    );
  }
}

export default App;