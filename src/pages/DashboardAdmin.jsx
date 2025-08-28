import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, Routes, Route, NavLink, Outlet } from "react-router-dom";
import Forbidden404 from "./Forbidden404";
import { logout } from "../store/authSlice";
import TicketsAdmin from "../components/TicketsAdmin";
import AutosAdmin from "../components/AutosAdmin";
import ClientesAdmin from "../components/ClientesAdmin";
import NotificacionesAdmin from "../components/NotificacionesAdmin";
import PerfilAdmin from "../components/PerfilAdmin";

const MODULES = [
  {
    key: "reservas",
    label: "Ver reservas",
    icon: <i className="bi bi-card-list" style={{fontSize: 32}}></i>,
    path: "reservas",
    element: <TicketsAdmin />,
  },
  {
    key: "autos",
    label: "Ver autos",
    icon: <i className="bi bi-car-front" style={{fontSize: 32}}></i>,
    path: "autos",
    element: <AutosAdmin />,
  },
  {
    key: "clientes",
    label: "Clientes",
    icon: <i className="bi bi-people" style={{fontSize: 32}}></i>,
    path: "clientes",
    element: <ClientesAdmin />,
  },
  {
    key: "perfil",
    label: "Perfil admin",
    icon: <i className="bi bi-person-circle" style={{fontSize: 32}}></i>,
    path: "perfil",
    element: <PerfilAdmin />,
  },
];

export default function DashboardAdmin() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  if (user && user.rol !== "admin") return <Forbidden404 />;
  if (user === undefined) {
    return <div className="text-center mt-5">Cargando usuario...</div>;
  }
  if (!user) {
    return <div className="alert alert-danger m-5">No hay usuario en sesión. Por favor, inicia sesión de nuevo.</div>;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Mostrar "Bienvenido" y el nombre del admin
  let nombreBienvenida = "Bienvenido";
  if (user?.nombre || user?.apellido) {
    let nombre = (user?.nombre || "").trim();
    let apellido = (user?.apellido || "").trim();
    let completo = (nombre + (apellido ? " " + apellido : "")).trim();
    if (completo) {
      nombreBienvenida = `Bienvenido, ${completo}`;
    }
  }

  // Si está en /dashboard/admin, mostrar menú y bienvenida
  const isLanding = location.pathname === "/dashboard/admin";

  return (
    <div className="d-flex min-vh-100" style={{background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'}}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-4" style={{minWidth: 220, borderTopRightRadius: 24, borderBottomRightRadius: 24}}>
        {/* Botón de casa tipo técnico */}
        <div className="mb-4 text-center">
          <button className="btn btn-light rounded-circle shadow-sm" style={{width:48,height:48}} onClick={()=>navigate("/dashboard/admin")}> 
            <i className="bi bi-house-door-fill text-primary" style={{fontSize:28}}></i>
          </button>
        </div>
        <h4 className="fw-bold mb-4"><i className="bi bi-speedometer2 me-2"></i>Menú</h4>
        <ul className="nav flex-column gap-2">
          {MODULES.map(m => (
            <li className="nav-item" key={m.key}>
              <NavLink className={({isActive}) => `nav-link text-white fw-semibold w-100 text-start${isActive ? ' bg-secondary' : ''}`} style={{border:0, background:'none'}} to={`/dashboard/admin/${m.path}`} end>
                <span className="me-2">{m.icon}</span> {m.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button className="btn btn-light mt-5 w-100 fw-bold" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión</button>
      </div>
      {/* Main content */}
      <div className="flex-grow-1 p-5">
        {isLanding && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold"><i className="bi bi-person-circle me-2 text-primary"></i>{nombreBienvenida}</h2>
          </div>
        )}
        {isLanding && (
          <div className="row g-4">
            {MODULES.map((m) => (
              <div className="col-12 col-md-6 col-lg-4" key={m.key}>
                <NavLink to={`/dashboard/admin/${m.path}`} style={{textDecoration:'none'}}>
                  <div className="card shadow-sm h-100" style={{cursor:'pointer', border:'none', background:'#f8f9fa'}}>
                    <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                      <div className="mb-2 text-primary">{m.icon}</div>
                      <h5 className="card-title fw-bold mb-2">{m.label}</h5>
                      <p className="card-text text-muted">Gestiona {m.label.toLowerCase()} del sistema</p>
                    </div>
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
        )}
  {/* Renderizar módulo o formulario según la ruta anidada */}
  <Outlet />
      </div>
    </div>
  );
}
