

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function NotificacionesAdmin() {
  const token = useSelector((state) => state.auth.token);
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API_URL}/technicians/pendientes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPendientes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const aprobar = async (id) => {
    try {
      await axios.put(`${API_URL}/technicians/${id}/aprobar`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendientes(p => p.filter(t => t._id !== id));
      setMsg("Técnico aprobado correctamente");
    } catch (err) {
      setMsg("Error al aprobar técnico");
    }
  };
  const rechazar = async (id) => {
    try {
      await axios.delete(`${API_URL}/technicians/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendientes(p => p.filter(t => t._id !== id));
      setMsg("Técnico rechazado y eliminado");
    } catch (err) {
      setMsg("Error al rechazar técnico");
    }
  };

  return (
    <div className="container" style={{maxWidth: 600}}>
      <h4 className="mb-3">Técnicos pendientes de aprobación</h4>
      {loading ? (
        <div className="text-center my-4">Cargando notificaciones...</div>
      ) : (
        <ul className="list-group">
          {pendientes.length === 0 && <li className="list-group-item">No hay técnicos pendientes de aprobación.</li>}
          {pendientes.map(n => (
            <li key={n._id} className="list-group-item d-flex align-items-center justify-content-between list-group-item-warning">
              <div className="d-flex align-items-center">
                <i className="bi bi-person-badge me-3"></i>
                <span>
                  <b>{n.nombre} {n.apellido}</b> fue creado por <b>{n.creadoPor?.nombre ? `${n.creadoPor.nombre} ${n.creadoPor.apellido}` : 'Administrador'}</b>.<br/>
                  ¿Desea aprobar o rechazar la creación de este técnico?
                </span>
              </div>
              <div>
                <button className="btn btn-sm btn-success me-2" onClick={() => aprobar(n._id)}><i className="bi bi-check-circle me-1"></i>Aprobar</button>
                <button className="btn btn-sm btn-danger" onClick={() => rechazar(n._id)}><i className="bi bi-x-circle me-1"></i>Rechazar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="alert alert-info mt-4">Aquí verás solicitudes de aprobación de técnicos. {msg && <span className={msg.includes('correctamente') ? 'text-success' : 'text-danger'}>{msg}</span>}</div>
    </div>
  );
}
