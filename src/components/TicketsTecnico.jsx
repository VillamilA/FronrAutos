import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function TicketsTecnico() {
  const token = useSelector((state) => state.auth.token);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ open: false, mode: null, ticket: null });

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/tickets/mis-tickets/tecnico`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTickets(res.data);
        setError("");
      } catch (err) {
        setError("No se pudieron cargar los tickets");
      }
      setLoading(false);
    };
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
  }, [token]);

  // Modal handlers
  const handleVer = (ticket) => setModal({ open: true, mode: "ver", ticket });
  const handleEditar = (ticket) => setModal({ open: true, mode: "editar", ticket: { ...ticket } });
  const closeModal = () => setModal({ open: false, mode: null, ticket: null });


  // Actualizar ticket (estado, descripción, solución)
  const handleUpdate = async (e) => {
    e.preventDefault();
    const t = modal.ticket;
    if (!t.description || !t.status) {
      alert("Descripción y estado son obligatorios");
      return;
    }
    try {
      const payload = {
        description: t.description,
        status: t.status,
        solucion: t.solucion || ""
      };
      const res = await axios.put(`${API_URL}/tickets/${t._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(tickets.map(x => x._id === t._id ? res.data : x));
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Error al actualizar ticket");
    }
  };

  // Cerrar ticket (estado resuelto)
  const handleCerrar = async () => {
    const t = modal.ticket;
    if (!t.solucion || t.solucion.trim() === "") {
      alert("Debes ingresar la solución antes de cerrar el ticket.");
      return;
    }
    try {
      const payload = {
        status: "resuelto",
        solucion: t.solucion
      };
      const res = await axios.put(`${API_URL}/tickets/${t._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(tickets.map(x => x._id === t._id ? res.data : x));
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Error al cerrar ticket");
    }
  };

  // Enviar a servicio técnico
  const handleEnviarServicio = async () => {
    const t = modal.ticket;
    if (!t.solucion || t.solucion.trim() === "") {
      alert("Debes ingresar la solución antes de enviar a servicio técnico.");
      return;
    }
    try {
      const payload = {
        status: "enviado a servicio tecnico",
        solucion: t.solucion
      };
      const res = await axios.put(`${API_URL}/tickets/${t._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(tickets.map(x => x._id === t._id ? res.data : x));
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Error al enviar a servicio técnico");
    }
  };

  // Eliminar ticket
  const handleEliminar = async () => {
    const t = modal.ticket;
    if (!window.confirm("¿Seguro que deseas eliminar este ticket?")) return;
    try {
      await axios.delete(`${API_URL}/tickets/${t._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(tickets.filter(x => x._id !== t._id));
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar ticket");
    }
  };

  if (loading) return <div className="text-center my-5">Cargando tickets...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4><i className="bi bi-card-list text-success me-2"></i>Mis Tickets</h4>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white rounded shadow-sm">
          <thead className="table-success">
            <tr>
              <th><i className="bi bi-hash"></i> ID</th>
              <th><i className="bi bi-qr-code"></i> Código</th>
              <th><i className="bi bi-person"></i> Cliente</th>
              <th><i className="bi bi-chat-left-text"></i> Título</th>
              <th><i className="bi bi-info-circle"></i> Estado</th>
              <th><i className="bi bi-calendar"></i> Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket._id}>
                <td>{ticket._id.slice(-6)}</td>
                <td>{ticket.codigo || '-'}</td>
                <td>{ticket.cliente ? `${ticket.cliente.nombre || ''} ${ticket.cliente.apellido || ''}`.trim() : '-'}</td>
                <td>{ticket.title}</td>
                <td><span className={`badge px-3 py-2 fw-semibold bg-${getStatusColor(ticket.status)}`}>{ticket.status}</span></td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-outline-info me-2" title="Ver" onClick={() => handleVer(ticket)}><i className="bi bi-eye"></i></button>
                  <button className="btn btn-sm btn-outline-warning" title="Editar" onClick={() => handleEditar(ticket)}><i className="bi bi-pencil"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal flotante */}
      {modal.open && (
        <div className="modal fade show d-block" tabIndex="-1" style={{background: 'rgba(0,0,0,0.3)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modal.mode === "ver" && <><i className="bi bi-eye me-2"></i>Detalle del Ticket</>}
                  {modal.mode === "editar" && <><i className="bi bi-pencil me-2"></i>Editar Ticket</>}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {modal.mode === "ver" && (
                  <div>
                    <div><strong>Título:</strong> {modal.ticket.title}</div>
                    <div><strong>Descripción:</strong> {modal.ticket.description}</div>
                    <div><strong>Cliente:</strong> {modal.ticket.cliente ? `${modal.ticket.cliente.nombre || ''} ${modal.ticket.cliente.apellido || ''}`.trim() : '-'}</div>
                    <div><strong>Estado:</strong> {modal.ticket.status}</div>
                    <div className="mb-2">
                      <strong>Solución:</strong>
                      <div style={{
                        maxHeight: '120px',
                        overflowY: 'auto',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        padding: '10px',
                        marginTop: '4px',
                        wordBreak: 'break-word',
                        fontSize: '1rem',
                        fontFamily: 'Nunito, Arial, sans-serif',
                        color: '#333',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                      }}>
                        {modal.ticket.solucion || <span className="text-muted">Sin solución</span>}
                      </div>
                    </div>
                    <div><strong>Fecha creación:</strong> {new Date(modal.ticket.createdAt).toLocaleString()}</div>
                  </div>
                )}
                {modal.mode === "editar" && (
                  <form onSubmit={handleUpdate}>
                    <div className="mb-2">
                      <label className="form-label">Descripción</label>
                      <textarea className="form-control" value={modal.ticket.description} onChange={e => setModal(m => ({...m, ticket: {...m.ticket, description: e.target.value}}))} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Estado</label>
                      <select className="form-select" value={modal.ticket.status} onChange={e => setModal(m => ({...m, ticket: {...m.ticket, status: e.target.value}}))}>
                        <option value="pendiente">Pendiente</option>
                        <option value="en progreso">En progreso</option>
                        <option value="enviado a servicio tecnico">Enviado a servicio técnico</option>
                        <option value="resuelto">Resuelto</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Solución</label>
                      <textarea className="form-control" value={modal.ticket.solucion || ""} onChange={e => setModal(m => ({...m, ticket: {...m.ticket, solucion: e.target.value}}))} placeholder="Describe la solución o motivo de envío a servicio técnico" />
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button type="submit" className="btn btn-success"><i className="bi bi-save me-2"></i>Guardar</button>
                      <button type="button" className="btn btn-primary" onClick={handleCerrar}><i className="bi bi-check2-circle me-2"></i>Cerrar ticket</button>
                      <button type="button" className="btn btn-warning" onClick={handleEnviarServicio}><i className="bi bi-truck me-2"></i>Enviar a servicio técnico</button>
                      <button type="button" className="btn btn-danger" onClick={handleEliminar}><i className="bi bi-trash me-2"></i>Eliminar</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status) {
  switch ((status || "").toLowerCase()) {
    case "pendiente": return "secondary";
    case "en progreso": return "warning";
    case "gestionado": return "info";
    case "resuelto": return "success";
    default: return "light";
  }
}
