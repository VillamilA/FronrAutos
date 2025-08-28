import React from "react";
import { useNavigate } from "react-router-dom";

export default function Forbidden404() {
  const navigate = useNavigate();
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient" style={{background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'}}>
      <div className="card shadow-lg px-5 py-5 text-center" style={{minWidth: 350, maxWidth: 480, width: '100%', borderRadius: 24, border: 'none'}}>
        <div className="display-1 fw-bold text-danger mb-4" style={{fontSize: '5.5rem', letterSpacing: '2px', fontFamily: 'Nunito, Arial, sans-serif'}}>404</div>
        <div className="h3 fw-bold mb-3" style={{fontFamily: 'Nunito, Arial, sans-serif'}}>Esta página no existe para ti</div>
        <p className="text-muted mb-5" style={{fontSize: '1.15rem', lineHeight: 1.7}}>
          No tienes permisos para acceder a esta sección.<br/>
          Si crees que es un error, contacta al administrador.
        </p>
        <button className="btn btn-primary btn-lg w-100 shadow-sm" style={{fontSize: '1.15rem', padding: '0.85rem 0'}} onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    </div>
  );
}
