import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validatePersonaFields } from "../utils/validatePersona";

const API_URL = import.meta.env.VITE_API_URL;

export default function ClientesAdmin() {
  const token = useSelector((state) => state.auth.token);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Modal state
  const [modal, setModal] = useState({ open: false, mode: null, cliente: null });

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/clients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClientes(res.data);
        setError("");
      } catch (err) {
        setError("No se pudieron cargar los clientes");
      }
      setLoading(false);
    };
    fetchClientes();
  }, [token]);

  // Abrir modal de ver
  const handleVer = (cliente) => {
    setModal({ open: true, mode: "ver", cliente });
  };

  // Abrir modal de editar
  const handleEditar = (cliente) => {
    // Clonar el objeto para evitar mutaciones directas
    setModal({ open: true, mode: "editar", cliente: { ...cliente } });
  }

  // Abrir modal de eliminar
  const handleEliminar = (cliente) => {
    setModal({ open: true, mode: "eliminar", cliente });
  };

  // Cerrar modal
  const closeModal = () => setModal({ open: false, mode: null, cliente: null });

  // Guardar cambios de edición
  const handleUpdate = async (e) => {
    e.preventDefault();
    // Validación estricta
    const cliente = modal.cliente;
    const { nombre, apellido, cedula, telefono, fecha_nacimiento, email } = cliente;
    const errorMsg = validatePersonaFields({
      nombre,
      apellido,
      cedula,
      telefono,
      fecha_nacimiento,
      email
    });
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    try {
      // Enviar todos los campos requeridos
      const payload = {
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        email: cliente.email,
        cedula: cliente.cedula,
        ciudad: cliente.ciudad,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        fecha_nacimiento: cliente.fecha_nacimiento,
        dependencia: cliente.dependencia
      };
      console.log('Actualizando cliente:', cliente._id, payload);
      const res = await axios.put(`${API_URL}/clients/${cliente._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientes(clientes.map(c => c._id === cliente._id ? res.data : c));
      closeModal();
    } catch (err) {
      console.error('Error al actualizar cliente:', err.response?.data || err);
      alert(err.response?.data?.message || "Error al actualizar cliente");
    }
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/clients/${modal.cliente._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientes(clientes.filter(c => c._id !== modal.cliente._id));
      closeModal();
    } catch (err) {
      alert("Error al eliminar cliente");
    }
  };

  if (loading) return <div className="text-center my-5">Cargando clientes...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4><i className="bi bi-people text-primary me-2"></i>Todos los Clientes</h4>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard/admin/crear-cliente')}>
          <i className="bi bi-plus-circle me-2"></i>Crear Cliente
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white rounded shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
               <th>Cédula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente._id}>
                <td>{cliente._id.slice(-6)}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.email}</td>
                  <td>{cliente.cedula}</td>
                <td>
                  <button className="btn btn-sm btn-outline-info me-2" title="Ver" onClick={() => handleVer(cliente)}><i className="bi bi-eye"></i></button>
                  <button className="btn btn-sm btn-outline-warning me-2" title="Editar" onClick={() => handleEditar(cliente)}><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={() => handleEliminar(cliente)}><i className="bi bi-trash"></i></button>
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
                {modal.mode === "ver" && <><i className="bi bi-eye me-2"></i>Detalle del Cliente</>}
                {modal.mode === "editar" && <><i className="bi bi-pencil me-2"></i>Editar Cliente</>}
                {modal.mode === "eliminar" && <><i className="bi bi-trash me-2"></i>Eliminar Cliente</>}
              </h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              {modal.mode === "ver" && (
                <div>
                  <div><strong>Nombre:</strong> {modal.cliente.nombre}</div>
                  <div><strong>Apellido:</strong> {modal.cliente.apellido}</div>
                  <div><strong>Email:</strong> {modal.cliente.email}</div>
                  <div><strong>Cédula:</strong> {modal.cliente.cedula}</div>
                  <div><strong>Ciudad:</strong> {modal.cliente.ciudad}</div>
                  <div><strong>Dirección:</strong> {modal.cliente.direccion}</div>
                  <div><strong>Teléfono:</strong> {modal.cliente.telefono}</div>
                  <div><strong>Fecha nacimiento:</strong> {modal.cliente.fecha_nacimiento?.slice(0,10)}</div>
                  <div><strong>Dependencia:</strong> {modal.cliente.dependencia}</div>
                </div>
              )}
              {modal.mode === "editar" && (
                <form onSubmit={handleUpdate}>
                  <div className="mb-2">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" value={modal.cliente.nombre} onChange={e => setModal(m => ({...m, cliente: {...m.cliente, nombre: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Apellido</label>
                    <input className="form-control" value={modal.cliente.apellido} onChange={e => setModal(m => ({...m, cliente: {...m.cliente, apellido: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Email</label>
                    <input className="form-control" value={modal.cliente.email} onChange={e => setModal(m => ({...m, cliente: {...m.cliente, email: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Cédula</label>
                    <input className="form-control" value={modal.cliente.cedula} onChange={e => setModal(m => ({...m, cliente: {...m.cliente, cedula: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Ciudad</label>
                    <input className="form-control" value={modal.cliente.ciudad} onChange={e => setModal(m => ({...m, cliente: {...m.cliente, ciudad: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Dirección</label>
                    <input className="form-control" value={modal.cliente.direccion} onChange={e => setModal(m => ({...m, cliente: {...m.cliente, direccion: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Teléfono</label>
                    <input className="form-control" value={modal.cliente.telefono} onChange={e => setModal(m => ({...m, cliente: {...m.cliente, telefono: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Fecha nacimiento</label>
                    <input type="date" className="form-control" value={modal.cliente.fecha_nacimiento?.slice(0,10)} onChange={e => setModal(m => ({...m, cliente: {...m.cliente, fecha_nacimiento: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Dependencia</label>
                    <input className="form-control" value={modal.cliente.dependencia} onChange={e => setModal(m => ({...m, cliente: {...m.cliente, dependencia: e.target.value}}))} />
                  </div>
                  <button type="submit" className="btn btn-success mt-2"><i className="bi bi-save me-2"></i>Guardar</button>
                </form>
              )}
              {modal.mode === "eliminar" && (
                <div>
                  <p>¿Seguro que deseas eliminar al cliente <strong>{modal.cliente.nombre} {modal.cliente.apellido}</strong>?</p>
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
