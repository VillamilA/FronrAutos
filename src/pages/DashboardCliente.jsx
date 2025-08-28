
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";
import TicketsCliente from "../components/TicketsCliente";
import PerfilCliente from "../components/PerfilCliente";
import CrearReserva from "./CrearReserva";
import Carousel from 'react-bootstrap/Carousel';

const MODULES = [
  {
    key: "reservas",
    label: "Mis Reservas",
    icon: <i className="bi bi-car-front-fill" style={{fontSize: 28}}></i>,
    path: "reservas",
    element: <TicketsCliente />,
  },
  {
    key: "crear-reserva",
    label: "Reservar Auto",
    icon: <i className="bi bi-calendar-plus" style={{fontSize: 28}}></i>,
    path: "crear-reserva",
    element: <CrearReserva />,
  },
  {
    key: "perfil",
    label: "Perfil",
    icon: <i className="bi bi-person-circle" style={{fontSize: 28}}></i>,
    path: "perfil",
    element: <PerfilCliente />,
  },
];

export default function DashboardCliente() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Bienvenida personalizada
  let nombreBienvenida = "Bienvenido";
  if (user?.nombre || user?.apellido) {
    let nombre = (user?.nombre || "").trim();
    let apellido = (user?.apellido || "").trim();
    let completo = (nombre + (apellido ? " " + apellido : "")).trim();
    if (completo) {
      nombreBienvenida = `Bienvenido, ${completo}`;
    }
  }

  // Si está en /dashboard/cliente, mostrar menú y bienvenida
  const isLanding = location.pathname === "/dashboard/cliente";

  return (
    <div className="d-flex min-vh-100" style={{background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'}}>
      {/* Sidebar */}
      <div className="bg-primary text-white p-4" style={{minWidth: 220, borderTopRightRadius: 24, borderBottomRightRadius: 24}}>
        <div className="d-flex justify-content-center align-items-center mb-4" style={{height: 70}}>
          <button className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{width:48,height:48}} onClick={()=>navigate("/dashboard/cliente")}> 
            <i className="bi bi-house-door-fill text-primary" style={{fontSize:28}}></i>
          </button>
        </div>
        <h4 className="fw-bold mb-4"><i className="bi bi-speedometer2 me-2"></i>Menú</h4>
        <ul className="nav flex-column gap-2">
          {MODULES.map(m => (
            <li className="nav-item" key={m.key}>
              <NavLink className={({isActive}) => `nav-link text-white fw-semibold w-100 text-start${isActive ? ' bg-secondary' : ''}`} style={{border:0, background:'none'}} to={`/dashboard/cliente/${m.path}`} end>
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
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold"><i className="bi bi-person-circle me-2 text-primary"></i>{nombreBienvenida}</h2>
            </div>
            {/* Carrusel de bienvenida */}
            <div className="mb-5">
              <Carousel fade interval={4000} indicators={false} style={{maxWidth: 900, margin: '0 auto', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.10)'}}>
                <Carousel.Item>
                  <img className="d-block w-100" src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80" alt="Bienvenido" style={{height: 380, objectFit: 'cover'}} />
                  <Carousel.Caption>
                    <h2 className="fw-bold text-white mb-2">¡Bienvenido a tu área de reservas!</h2>
                    <p className="text-white fs-5">Gestiona tus reservas de autos y mantén tu información actualizada fácilmente.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src="https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=1200&q=80" alt="Reservar" style={{height: 380, objectFit: 'cover'}} />
                  <Carousel.Caption>
                    <h2 className="fw-bold text-white mb-2">Reserva tu auto fácilmente</h2>
                    <p className="text-white fs-5">Elige el auto y las fechas que necesitas, ¡y listo!</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80" alt="Perfil" style={{height: 380, objectFit: 'cover'}} />
                  <Carousel.Caption>
                    <h2 className="fw-bold text-white mb-2">Actualiza tu perfil</h2>
                    <p className="text-white fs-5">Mantén tus datos siempre al día para una mejor experiencia.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
            <div className="row g-4">
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm h-100" style={{cursor:'pointer', border:'none', background:'#f8f9fa'}} onClick={()=>navigate('/dashboard/cliente/reservas')}>
                  <i className="bi bi-car-front-fill text-primary" style={{fontSize: 60, margin:'24px auto 0 auto', display:'block'}}></i>
                  <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                    <h5 className="card-title fw-bold mb-2">Mis Reservas</h5>
                    <p className="card-text text-muted">Consulta y gestiona tus reservas de autos</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm h-100" style={{cursor:'pointer', border:'none', background:'#f8f9fa'}} onClick={()=>navigate('/dashboard/cliente/crear-reserva')}>
                  <i className="bi bi-calendar-plus text-success" style={{fontSize: 60, margin:'24px auto 0 auto', display:'block'}}></i>
                  <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                    <h5 className="card-title fw-bold mb-2">Reservar Auto</h5>
                    <p className="card-text text-muted">Solicita una nueva reserva de auto</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm h-100" style={{cursor:'pointer', border:'none', background:'#f8f9fa'}} onClick={()=>navigate('/dashboard/cliente/perfil')}>
                  <i className="bi bi-person-circle text-secondary" style={{fontSize: 60, margin:'24px auto 0 auto', display:'block'}}></i>
                  <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                    <h5 className="card-title fw-bold mb-2">Perfil</h5>
                    <p className="card-text text-muted">Edita tus datos personales</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Renderizar módulo o formulario según la ruta anidada */}
        <div className="mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
