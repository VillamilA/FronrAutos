import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import TicketsTecnico from "./TicketsTecnico";

const API_URL = import.meta.env.VITE_API_URL;

export default function NotificacionesTecnico() {
  const token = useSelector((state) => state.auth.token);
  const [pendientes, setPendientes] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendientes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/tickets/pendientes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendientes(res.data);
      } catch (err) {
        setMsg("No se pudieron cargar los tickets pendientes");
      }
      setLoading(false);
    };
    fetchPendientes();
  }, [token]);

  const tomarTicket = async (id) => {
    try {
      await axios.put(`${API_URL}/tickets/${id}/tomar`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendientes(p => p.filter(t => t._id !== id));
      setMsg("Ticket tomado correctamente");
      // Forzar recarga de tickets del técnico si existe el componente
      if (window.location.pathname.includes("/dashboard/tecnico")) {
        setTimeout(() => window.location.reload(), 800);
      }
    } catch (err) {
      setMsg("Error al tomar ticket");
    }
  };

  return (
    <div className="container" style={{maxWidth: 600}}>
      <h3 className="mb-4"><i className="bi bi-bell me-2"></i>Notificaciones</h3>
      {loading ? (
        <div className="text-center my-4">Cargando notificaciones...</div>
      ) : (
        <ul className="list-group">
          {pendientes.length === 0 && <li className="list-group-item">No hay tickets pendientes por tomar.</li>}
          {pendientes.map(n => (
            <li key={n._id} className="list-group-item d-flex align-items-center justify-content-between list-group-item-warning">
              <div>
                <b>{n.title}</b> - {n.description}<br/>
                <span className="text-muted">Cliente: {n.cliente?.nombre || '-'}</span>
              </div>
              <button className="btn btn-sm btn-success" onClick={() => tomarTicket(n._id)}><i className="bi bi-check-circle me-1"></i>Tomar ticket</button>
            </li>
          ))}
        </ul>
      )}
      <div className="alert alert-info mt-4">Aquí verás tickets pendientes por tomar. {msg && <span className={msg.includes('correctamente') ? 'text-success' : 'text-danger'}>{msg}</span>}</div>
    </div>
  );
}
