
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReservasAdmin() {
  const token = useSelector((state) => state.auth.token);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ open: false, mode: null, reserva: null });
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  useEffect(() => {
    const fetchReservas = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/reserva`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservas(res.data);
        setError("");
      } catch (err) {
        setError("No se pudieron cargar las reservas");
      }
      setLoading(false);
    };
    fetchReservas();
  }, [token]);

  // Cargar clientes y autos para selects en edición
  useEffect(() => {
    if (!modal.open || modal.mode !== "editar") return;
    const fetchUsersAndVehiculos = async () => {
      try {
        const [clis, vehs] = await Promise.all([
          axios.get(`${API_URL}/clients`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/vehiculos`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setClientes(clis.data);
        setVehiculos(vehs.data);
      } catch {}
    };
    fetchUsersAndVehiculos();
  }, [modal.open, modal.mode, token]);

  // Modal handlers
  const handleVer = (reserva) => setModal({ open: true, mode: "ver", reserva });
  const handleEditar = (reserva) => setModal({ open: true, mode: "editar", reserva: { ...reserva } });
  const handleEliminar = (reserva) => setModal({ open: true, mode: "eliminar", reserva });
  const closeModal = () => setModal({ open: false, mode: null, reserva: null });

  // Actualizar reserva
  const handleUpdate = async (e) => {
    e.preventDefault();
    const r = modal.reserva;
    if (!r.descripcion || !r.cliente || !r.vehiculo) {
      alert("Todos los campos son obligatorios");
      return;
    }
    try {
      const payload = {
        descripcion: r.descripcion,
        cliente: r.cliente?._id || r.cliente,
        vehiculo: r.vehiculo?._id || r.vehiculo,
        fecha_inicio: r.fecha_inicio,
        fecha_fin: r.fecha_fin
      };
      const res = await axios.put(`${API_URL}/reserva/${r._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservas(reservas.map(x => x._id === r._id ? res.data : x));
      closeModal();
    } catch (err) {
      alert(err.response?.data?.error || "Error al actualizar reserva");
    }
  };

  // Eliminar reserva
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/reserva/${modal.reserva._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservas(reservas.filter(x => x._id !== modal.reserva._id));
      closeModal();
    } catch (err) {
      alert("Error al eliminar reserva");
    }
  };

  if (loading) return <div className="text-center my-5">Cargando reservas...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;

  // Aprobar/rechazar reserva
  const handleAprobar = async (reserva) => {
    try {
      const res = await axios.put(`${API_URL}/reserva/${reserva._id}`, { status: 'aprobada' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservas(reservas.map(x => x._id === reserva._id ? res.data : x));
    } catch (err) {
      alert('Error al aprobar la reserva');
    }
  };
  const handleRechazar = async (reserva) => {
    try {
      const res = await axios.put(`${API_URL}/reserva/${reserva._id}`, { status: 'rechazada' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservas(reservas.map(x => x._id === reserva._id ? res.data : x));
    } catch (err) {
      alert('Error al rechazar la reserva');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4><i className="bi bi-car-front-fill text-primary me-2"></i>Autos reservados</h4>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white rounded shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Cliente</th>
              <th>Vehículo</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map(reserva => (
              <tr key={reserva._id}>
                <td>{reserva._id.slice(-6)}</td>
                <td>{reserva.codigo}</td>
                <td>{reserva.cliente ? `${reserva.cliente.nombre || ''} ${reserva.cliente.apellido || ''}`.trim() : '-'}</td>
                <td>{reserva.vehiculo?.marca} {reserva.vehiculo?.modelo} ({reserva.vehiculo?.placa})</td>
                <td>{reserva.fecha_inicio ? new Date(reserva.fecha_inicio).toLocaleDateString() : '-'}</td>
                <td>{reserva.fecha_fin ? new Date(reserva.fecha_fin).toLocaleDateString() : '-'}</td>
                <td><span className={`badge px-3 py-2 fw-semibold bg-${reserva.status === 'aprobada' ? 'success' : reserva.status === 'rechazada' ? 'danger' : 'warning'}`}>{reserva.status}</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-info me-2" title="Ver" onClick={() => handleVer(reserva)}><i className="bi bi-eye"></i></button>
                  <button className="btn btn-sm btn-outline-warning me-2" title="Editar" onClick={() => handleEditar(reserva)}><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-sm btn-outline-danger me-2" title="Eliminar" onClick={() => handleEliminar(reserva)}><i className="bi bi-trash"></i></button>
                  {reserva.status === 'pendiente' && (
                    <>
                      <button className="btn btn-sm btn-success me-1" title="Aprobar" onClick={() => handleAprobar(reserva)}><i className="bi bi-check-lg"></i></button>
                      <button className="btn btn-sm btn-danger" title="Rechazar" onClick={() => handleRechazar(reserva)}><i className="bi bi-x-lg"></i></button>
                    </>
                  )}
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
                  {modal.mode === "ver" && <><i className="bi bi-eye me-2"></i>Detalle de la Reserva</>}
                  {modal.mode === "editar" && <><i className="bi bi-pencil me-2"></i>Editar Reserva</>}
                  {modal.mode === "eliminar" && <><i className="bi bi-trash me-2"></i>Eliminar Reserva</>}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {modal.mode === "ver" && (
                  <div>
                    <div><strong>Cliente:</strong> {modal.reserva.cliente ? `${modal.reserva.cliente.nombre || ''} ${modal.reserva.cliente.apellido || ''}`.trim() : '-'}</div>
                    <div><strong>Vehículo:</strong> {modal.reserva.vehiculo ? `${modal.reserva.vehiculo.marca} ${modal.reserva.vehiculo.modelo} (${modal.reserva.vehiculo.placa})` : '-'}</div>
                    <div><strong>Descripción:</strong> {modal.reserva.descripcion}</div>
                    <div><strong>Código:</strong> {modal.reserva.codigo}</div>
                  </div>
                )}
                {modal.mode === "editar" && (
                  <form onSubmit={handleUpdate}>
                    <div className="mb-2">
                      <label className="form-label">Cliente</label>
                      <select className="form-select" value={modal.reserva.cliente?._id || modal.reserva.cliente || ''} onChange={e => setModal(m => ({...m, reserva: {...m.reserva, cliente: e.target.value}}))}>
                        <option value="">Selecciona un cliente</option>
                        {clientes.map(c => (
                          <option key={c._id} value={c._id}>{c.nombre} {c.apellido} ({c.cedula})</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Vehículo</label>
                      <select className="form-select" value={modal.reserva.vehiculo?._id || modal.reserva.vehiculo || ''} onChange={e => setModal(m => ({...m, reserva: {...m.reserva, vehiculo: e.target.value}}))}>
                        <option value="">Selecciona un vehículo</option>
                        {vehiculos.map(v => (
                          <option key={v._id} value={v._id}>{v.marca} {v.modelo} ({v.placa})</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Descripción</label>
                      <textarea className="form-control" value={modal.reserva.descripcion} onChange={e => setModal(m => ({...m, reserva: {...m.reserva, descripcion: e.target.value}}))} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Fecha inicio</label>
                      <input className="form-control" type="date" value={modal.reserva.fecha_inicio ? modal.reserva.fecha_inicio.slice(0,10) : ''} onChange={e => setModal(m => ({...m, reserva: {...m.reserva, fecha_inicio: e.target.value}}))} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Fecha fin</label>
                      <input className="form-control" type="date" value={modal.reserva.fecha_fin ? modal.reserva.fecha_fin.slice(0,10) : ''} onChange={e => setModal(m => ({...m, reserva: {...m.reserva, fecha_fin: e.target.value}}))} />
                    </div>
                    <button type="submit" className="btn btn-success mt-2 me-2"><i className="bi bi-save me-2"></i>Guardar</button>
                    {modal.reserva.status === 'pendiente' && (
                      <>
                        <button type="button" className="btn btn-success mt-2 me-2" onClick={() => handleAprobar(modal.reserva)}><i className="bi bi-check-lg me-2"></i>Aprobar</button>
                        <button type="button" className="btn btn-danger mt-2" onClick={() => handleRechazar(modal.reserva)}><i className="bi bi-x-lg me-2"></i>Rechazar</button>
                      </>
                    )}
                  </form>
                )}
                {modal.mode === "eliminar" && (
                  <div>
                    <p>¿Seguro que deseas eliminar la reserva <strong>{modal.reserva.descripcion}</strong>?</p>
                    <button className="btn btn-danger me-2" onClick={confirmDelete}><i className="bi bi-trash me-2"></i>Eliminar</button>
                    <button className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
