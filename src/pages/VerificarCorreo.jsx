import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function VerificarCorreo() {
  const navigate = useNavigate();
  const location = useLocation();
  // Permitir pasar email por query o state
  const emailFromQuery = new URLSearchParams(location.search).get("email");
  const [email, setEmail] = useState(emailFromQuery || "");
  const [codigo, setCodigo] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [reenviando, setReenviando] = useState(false);
  const [verificando, setVerificando] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerificando(true);
    setError("");
    setMsg("");
    try {
      await axios.post(`${API_URL}/auth/verify-email`, { email, codigo });
      setMsg("¡Correo verificado correctamente! Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al verificar el código");
    }
    setVerificando(false);
  };

  const handleResend = async () => {
    setReenviando(true);
    setError("");
    setMsg("");
    try {
      await axios.post(`${API_URL}/auth/resend-code`, { email });
      setMsg("Código reenviado. Revisa tu correo electrónico.");
    } catch (err) {
      setError(err.response?.data?.message || "Error al reenviar el código");
    }
    setReenviando(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient" style={{background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'}}>
      <div className="card shadow-lg px-5 py-5 text-center" style={{minWidth: 350, maxWidth: 480, width: '100%', borderRadius: 24, border: 'none'}}>
        <div className="display-1 fw-bold text-primary mb-4" style={{fontSize: '4rem'}}>Verifica tu correo</div>
        <p className="text-muted mb-4">Hemos enviado un código de verificación a tu correo electrónico.<br/>Ingresa el código para activar tu cuenta.</p>
        <form onSubmit={handleVerify}>
          <div className="mb-3">
            <input type="email" className="form-control text-center" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required disabled={!!emailFromQuery} />
          </div>
          <div className="mb-3">
            <input type="text" className="form-control text-center" placeholder="Código de verificación" value={codigo} onChange={e => setCodigo(e.target.value)} required />
          </div>
          <button className="btn btn-success w-100 mb-2" type="submit" disabled={verificando}>{verificando ? "Verificando..." : "Verificar"}</button>
        </form>
        <button className="btn btn-link text-primary" onClick={handleResend} disabled={reenviando}>{reenviando ? "Reenviando..." : "Reenviar código"}</button>
        {msg && <div className="alert alert-success mt-3">{msg}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}
