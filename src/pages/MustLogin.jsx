import React from "react";
import { Link } from "react-router-dom";

export default function MustLogin() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient" style={{background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'}}>
      <div className="card shadow-lg px-5 py-5 text-center" style={{minWidth: 350, maxWidth: 480, width: '100%', borderRadius: 24, border: 'none'}}>
        <div className="display-1 fw-bold text-primary mb-4" style={{fontSize: '5.5rem', letterSpacing: '2px', fontFamily: 'Nunito, Arial, sans-serif'}}>Oops!</div>
        <div className="h3 fw-bold mb-3" style={{fontFamily: 'Nunito, Arial, sans-serif'}}>¡Debes iniciar sesión primero!</div>
        <p className="text-muted mb-5" style={{fontSize: '1.15rem', lineHeight: 1.7}}>
          Para acceder a esta sección, inicia sesión con tu cuenta.<br/>
          <span className="d-block mt-2">¡Así podrás gestionar tus tickets y ver toda la información!</span>
        </p>
        <Link to="/login" className="btn btn-primary btn-lg w-100 shadow-sm" style={{fontSize: '1.15rem', padding: '0.85rem 0'}}>Ir al login</Link>
      </div>
    </div>
  );
}
