
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate, NavLink, Outlet, Routes, Route, useLocation } from "react-router-dom";
import TicketsTecnico from "../components/TicketsTecnico";
import NotificacionesTecnico from "../components/NotificacionesTecnico";
import PerfilTecnico from "../components/PerfilTecnico";
import AddTech from "../pages/AddTech";

import { useEffect, useState } from "react";
// ...existing code...

// Simulación: tickets nuevos (en real, usar redux o fetch)
function useTicketsNuevos() {
  const [hayNuevos, setHayNuevos] = useState(false);
  useEffect(() => {
    // Aquí deberías consultar la API o redux para saber si hay tickets nuevos
    // Simulación: alterna cada 10s
    const interval = setInterval(() => setHayNuevos(h => !h), 10000);
    return () => clearInterval(interval);
  }, []);
  return hayNuevos;
}

const MODULES = [
  {
    key: "tickets",
    label: "Mis Tickets",
    icon: <i className="bi bi-card-list" style={{fontSize: 28}}></i>,
    path: "tickets",
    element: <TicketsTecnico />,
  },
  {
    key: "notificaciones",
    label: "Tickets entrantes",
    icon: (
      <span style={{position:'relative',display:'inline-block'}}>
        <i className="bi bi-bell" style={{fontSize: 28}}></i>
        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{display:'inline-block',width:10,height:10}}></span>
      </span>
    ),
    path: "notificaciones",
    element: <NotificacionesTecnico />,
  },
  {
    key: "perfil",
    label: "Perfil",
    icon: <i className="bi bi-person-circle" style={{fontSize: 28}}></i>,
    path: "perfil",
    element: <PerfilTecnico />,
  },
  {
    key: "add-tech",
    label: "Crear Técnico",
    icon: <i className="bi bi-person-plus" style={{fontSize: 28}}></i>,
    path: "add-tech",
    element: <AddTech />,
  },
];

export default function DashboardTecnico() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const hayNuevos = useTicketsNuevos();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Si está en /dashboard/tecnico, mostrar menú y bienvenida
  const isLanding = location.pathname === "/dashboard/tecnico";

  let nombreBienvenida = "Bienvenido";
  if (user?.nombre || user?.apellido) {
    let nombre = (user?.nombre || "").trim();
    let apellido = (user?.apellido || "").trim();
    let completo = (nombre + (apellido ? " " + apellido : "")).trim();
    if (completo) {
      nombreBienvenida = `Bienvenido, ${completo}`;
    }
  }
  return (
    <div className="d-flex min-vh-100" style={{background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'}}>
      {/* Sidebar */}
      <div className="bg-success text-white p-4" style={{minWidth: 220, borderTopRightRadius: 24, borderBottomRightRadius: 24}}>
        {/* Icono casita dashboard */}
        <div className="mb-4 text-center">
          <button className="btn btn-light rounded-circle shadow-sm" style={{width:48,height:48}} onClick={()=>navigate("/dashboard/tecnico")}> 
            <i className="bi bi-house-door-fill text-success" style={{fontSize:28}}></i>
          </button>
        </div>
        <h4 className="fw-bold mb-4"><i className="bi bi-speedometer2 me-2"></i>Menú</h4>
        <ul className="nav flex-column gap-2">
          {MODULES.map(m => (
            <li className="nav-item" key={m.key}>
              <NavLink className={({isActive}) => `nav-link text-white fw-semibold w-100 text-start${isActive ? ' bg-secondary' : ''}`} style={{border:0, background:'none'}} to={`/dashboard/tecnico/${m.path}`} end>
                <span className="me-2">
                  {m.key === "notificaciones" && hayNuevos ? (
                    <span style={{position:'relative',display:'inline-block'}}>
                      <i className="bi bi-bell" style={{fontSize: 28}}></i>
                      <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{display:'inline-block',width:10,height:10}}></span>
                    </span>
                  ) : m.icon}
                </span> {m.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button className="btn btn-light mt-5 w-100 fw-bold" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión</button>
      </div>
      {/* Main content */}
      <div className="flex-grow-1 p-5">
        {isLanding && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold"><i className="bi bi-person-circle me-2 text-success"></i>{nombreBienvenida}</h2>
            </div>
            {/* Carousel Bootstrap animado */}
            <div id="carouselDashboard" className="carousel slide mb-5" data-bs-ride="carousel">
              <div className="carousel-inner rounded shadow">
                <div className="carousel-item active">
                  <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80" className="d-block w-100" alt="Soporte" style={{maxHeight:260,objectFit:'cover'}} />
                  <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
                    <h5>Gestiona tus tickets fácilmente</h5>
                    <p>Visualiza, responde y resuelve solicitudes desde un solo lugar.</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" className="d-block w-100" alt="Equipo" style={{maxHeight:260,objectFit:'cover'}} />
                  <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
                    <h5>Colabora con tu equipo</h5>
                    <p>Comparte información y mantente al tanto de los tickets entrantes.</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" className="d-block w-100" alt="Soporte" style={{maxHeight:260,objectFit:'cover'}} />
                  <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
                    <h5>Perfil profesional</h5>
                    <p>Actualiza tus datos y mantén tu información siempre al día.</p>
                  </div>
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselDashboard" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Anterior</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselDashboard" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Siguiente</span>
              </button>
            </div>
          </>
        )}
        {isLanding && (
          <div className="row g-4">
            {MODULES.map((m) => (
              <div className="col-12 col-md-6 col-lg-4" key={m.key}>
                <NavLink to={`/dashboard/tecnico/${m.path}`} style={{textDecoration:'none'}}>
                  <div className="card shadow-sm h-100" style={{cursor:'pointer', border:'none', background:'#f8f9fa'}}>
                    <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                      <div className="mb-2 text-success">{m.icon}</div>
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
        <Routes>
          {MODULES.map(m => (
            <Route key={m.key} path={m.path} element={m.element} />
          ))}
        </Routes>
      </div>
    </div>
  );
}
