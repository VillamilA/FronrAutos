
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReservasCliente() {
  const token = useSelector((state) => state.auth.token);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ open: false, mode: null, reserva: null });
  const [editForm, setEditForm] = useState({ motivo: '', fecha_inicio: '', fecha_fin: '' });
  const [msg, setMsg] = useState('');

  // Recargar reservas cada 10 segundos
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await axios.get(`${API_URL}/reserva`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservas(res.data);
      } catch (err) {
        setError("Error al cargar reservas");
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
    const interval = setInterval(fetchReservas, 10000);
    return () => clearInterval(interval);
  }, [token]);

  function getStatusColor(status) {
    switch ((status || '').toLowerCase()) {
      case 'pendiente': return 'warning';
      case 'aprobada': return 'success';
      case 'rechazada': return 'danger';
      case 'finalizada': return 'secondary';
      default: return 'light';
    }
  }

  const handleVer = (reserva) => setModal({ open: true, mode: 'ver', reserva });
  const handleEditar = (reserva) => {
    setEditForm({ motivo: reserva.motivo, fecha_inicio: reserva.fecha_inicio?.slice(0,10), fecha_fin: reserva.fecha_fin?.slice(0,10) });
    setModal({ open: true, mode: 'editar', reserva });
  };
  const handleEliminar = async (reserva) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta reserva?')) return;
    try {
      await axios.delete(`${API_URL}/reserva/${reserva._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setReservas(reservas.filter(x => x._id !== reserva._id));
      setMsg('Reserva eliminada correctamente');
    } catch {
      setMsg('Error al eliminar reserva');
    }
    setModal({ open: false, mode: null, reserva: null });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/reserva/${modal.reserva._id}`, {
        motivo: editForm.motivo,
        fecha_inicio: editForm.fecha_inicio,
        fecha_fin: editForm.fecha_fin
      }, { headers: { Authorization: `Bearer ${token}` } });
      setReservas(reservas.map(x => x._id === modal.reserva._id ? res.data : x));
      setMsg('Reserva actualizada correctamente');
      setModal({ open: false, mode: null, reserva: null });
    } catch {
      setMsg('Error al actualizar reserva');
    }
  };

  function canEdit(reserva) {
    if (reserva.status !== 'pendiente') return false;
    const created = new Date(reserva.createdAt);
    const now = new Date();
    return (now - created) / 60000 < 15; // menos de 15 minutos
  }

  if (loading) return <div>Cargando reservas...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-car-front-fill text-primary me-2" style={{fontSize:32}}></i>
        <h3 className="fw-bold mb-0">Mis Reservas</h3>
      </div>
      {msg && <div className={`alert mt-2 ${msg.includes('correctamente') ? 'alert-success' : 'alert-danger'}`}>{msg}</div>}
      {reservas.length === 0 ? (
        <div className="alert alert-info">No tienes reservas registradas.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded shadow-sm">
            <thead className="table-primary">
              <tr>
                <th><i className="bi bi-hash"></i> ID</th>
                <th><i className="bi bi-qr-code"></i> Código</th>
                <th><i className="bi bi-car-front"></i> Auto</th>
                <th><i className="bi bi-calendar"></i> Fecha inicio</th>
                <th><i className="bi bi-calendar-check"></i> Fecha fin</th>
                <th><i className="bi bi-info-circle"></i> Estado</th>
                <th><i className="bi bi-gear"></i> Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(reserva => (
                <tr key={reserva._id}>
                  <td>{reserva._id.slice(-6)}</td>
                  <td>{reserva.codigo}</td>
                  <td>{reserva.vehiculo?.modelo || reserva.vehiculo?.marca || '-'}</td>
                  <td>{reserva.fecha_inicio ? new Date(reserva.fecha_inicio).toLocaleDateString() : '-'}</td>
                  <td>{reserva.fecha_fin ? new Date(reserva.fecha_fin).toLocaleDateString() : '-'}</td>
                  <td><span className={`badge px-3 py-2 fw-semibold bg-${getStatusColor(reserva.status)}`}>{reserva.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-info me-1" title="Ver" onClick={() => handleVer(reserva)}><i className="bi bi-eye"></i></button>
                    <button className="btn btn-sm btn-outline-warning me-1" title="Editar" onClick={() => handleEditar(reserva)} disabled={!canEdit(reserva)}><i className="bi bi-pencil"></i></button>
                    <button className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={() => handleEliminar(reserva)} disabled={reserva.status !== 'pendiente'}><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal flotante */}
      {modal.open && (
        <div className="modal fade show d-block" tabIndex="-1" style={{background: 'rgba(0,0,0,0.3)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modal.mode === 'ver' && <><i className="bi bi-eye me-2"></i>Detalle de la Reserva</>}
                  {modal.mode === 'editar' && <><i className="bi bi-pencil me-2"></i>Editar Reserva</>}
                </h5>
                <button type="button" className="btn-close" onClick={() => setModal({ open: false, mode: null, reserva: null })}></button>
              </div>
              <div className="modal-body">
                {modal.mode === 'ver' && (
                  <div>
                    <div><strong>Auto:</strong> {modal.reserva.auto?.modelo || modal.reserva.auto?.marca || '-'}</div>
                    <div><strong>Motivo:</strong> {modal.reserva.motivo}</div>
                    <div><strong>Fecha inicio:</strong> {modal.reserva.fecha_inicio ? new Date(modal.reserva.fecha_inicio).toLocaleString() : '-'}</div>
                    <div><strong>Fecha fin:</strong> {modal.reserva.fecha_fin ? new Date(modal.reserva.fecha_fin).toLocaleString() : '-'}</div>
                    <div><strong>Estado:</strong> {modal.reserva.status}</div>
                    <div><strong>Fecha creación:</strong> {new Date(modal.reserva.createdAt).toLocaleString()}</div>
                  </div>
                )}
                {modal.mode === 'editar' && (
                  <form onSubmit={handleUpdate}>
                    <div className="mb-2">
                      <label className="form-label">Motivo</label>
                      <input className="form-control" value={editForm.motivo} onChange={e => setEditForm(f => ({...f, motivo: e.target.value}))} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Fecha inicio</label>
                      <input className="form-control" type="date" value={editForm.fecha_inicio} onChange={e => setEditForm(f => ({...f, fecha_inicio: e.target.value}))} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Fecha fin</label>
                      <input className="form-control" type="date" value={editForm.fecha_fin} onChange={e => setEditForm(f => ({...f, fecha_fin: e.target.value}))} />
                    </div>
                    <button type="submit" className="btn btn-success mt-2"><i className="bi bi-save me-2"></i>Guardar</button>
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
