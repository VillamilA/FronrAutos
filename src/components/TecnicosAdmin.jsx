import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function TecnicosAdmin() {
  const token = useSelector((state) => state.auth.token);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Modal state
  const [modal, setModal] = useState({ open: false, mode: null, tech: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTecnicos = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/technicians`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTecnicos(res.data);
        setError("");
      } catch (err) {
        setError("No se pudieron cargar los técnicos");
      }
      setLoading(false);
    };
    fetchTecnicos();
  }, [token]);


  // Simulación: técnicos con email que contiene 'pendiente' requieren aprobación
  const aprobarTecnico = (id) => {
    // Aquí iría la lógica real de aprobación (API)
    setTecnicos(tecnicos.map(t => t._id === id ? { ...t, aprobado: true } : t));
  };
  const rechazarTecnico = (id) => {
    // Aquí iría la lógica real de rechazo (API)
    setTecnicos(tecnicos.filter(t => t._id !== id));
  };

  // Abrir modal de ver
  const handleVer = (tech) => {
    setModal({ open: true, mode: "ver", tech });
  };

  // Abrir modal de editar
  const handleEditar = (tech) => {
    setModal({ open: true, mode: "editar", tech });
  };

  // Abrir modal de eliminar
  const handleEliminar = (tech) => {
    setModal({ open: true, mode: "eliminar", tech });
  };

  // Cerrar modal
  const closeModal = () => setModal({ open: false, mode: null, tech: null });

  // Guardar cambios de edición
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { tech } = modal;
      await axios.put(`${API_URL}/technicians/${tech._id}`, tech, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTecnicos(tecnicos.map(t => t._id === tech._id ? tech : t));
      closeModal();
    } catch (err) {
      alert("Error al actualizar técnico");
    }
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/technicians/${modal.tech._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTecnicos(tecnicos.filter(t => t._id !== modal.tech._id));
      closeModal();
    } catch (err) {
      alert("Error al eliminar técnico");
    }
  };

  if (loading) return <div className="text-center my-5">Cargando técnicos...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4><i className="bi bi-person-badge text-success me-2"></i>Todos los Técnicos</h4>
        <button className="btn btn-success" onClick={() => navigate('/dashboard/admin/crear-tecnico')}>
          <i className="bi bi-plus-circle me-2"></i>Crear Técnico/Admin
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white rounded shadow-sm">
          <thead className="table-success">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tecnicos.map(tech => (
              <tr key={tech._id}>
                <td>{tech._id.slice(-6)}</td>
                <td>{tech.nombre}</td>
                <td>{tech.apellido}</td>
                <td>{tech.email}</td>
                <td>
                  {/* Simulación de aprobación: si email contiene 'pendiente', mostrar aprobar/rechazar */}
                  {tech.email.includes('pendiente') && !tech.aprobado ? (
                    <>
                      <button className="btn btn-sm btn-outline-success me-2" title="Aprobar" onClick={() => aprobarTecnico(tech._id)}><i className="bi bi-check-circle"></i></button>
                      <button className="btn btn-sm btn-outline-danger me-2" title="Rechazar" onClick={() => rechazarTecnico(tech._id)}><i className="bi bi-x-circle"></i></button>
                    </>
                  ) : null}
                  <button className="btn btn-sm btn-outline-info me-2" title="Ver" onClick={() => handleVer(tech)}><i className="bi bi-eye"></i></button>
                  <button className="btn btn-sm btn-outline-warning me-2" title="Editar" onClick={() => handleEditar(tech)}><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={() => handleEliminar(tech)}><i className="bi bi-trash"></i></button>
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
                {modal.mode === "ver" && <><i className="bi bi-eye me-2"></i>Detalle del Técnico</>}
                {modal.mode === "editar" && <><i className="bi bi-pencil me-2"></i>Editar Técnico</>}
                {modal.mode === "eliminar" && <><i className="bi bi-trash me-2"></i>Eliminar Técnico</>}
              </h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              {modal.mode === "ver" && (
                <div>
                  <div><strong>Nombre:</strong> {modal.tech.nombre}</div>
                  <div><strong>Apellido:</strong> {modal.tech.apellido}</div>
                  <div><strong>Email:</strong> {modal.tech.email}</div>
                  <div><strong>Cédula:</strong> {modal.tech.cedula}</div>
                  <div><strong>Dirección:</strong> {modal.tech.direccion}</div>
                  <div><strong>Teléfono:</strong> {modal.tech.telefono}</div>
                  <div><strong>Fecha nacimiento:</strong> {modal.tech.fecha_nacimiento?.slice(0,10)}</div>
                  <div><strong>Género:</strong> {modal.tech.genero}</div>
                </div>
              )}
              {modal.mode === "editar" && (
                <form onSubmit={handleUpdate}>
                  <div className="mb-2">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" value={modal.tech.nombre} onChange={e => setModal(m => ({...m, tech: {...m.tech, nombre: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Apellido</label>
                    <input className="form-control" value={modal.tech.apellido} onChange={e => setModal(m => ({...m, tech: {...m.tech, apellido: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Email</label>
                    <input className="form-control" value={modal.tech.email} onChange={e => setModal(m => ({...m, tech: {...m.tech, email: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Cédula</label>
                    <input className="form-control" value={modal.tech.cedula} onChange={e => setModal(m => ({...m, tech: {...m.tech, cedula: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Dirección</label>
                    <input className="form-control" value={modal.tech.direccion} onChange={e => setModal(m => ({...m, tech: {...m.tech, direccion: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Teléfono</label>
                    <input className="form-control" value={modal.tech.telefono} onChange={e => setModal(m => ({...m, tech: {...m.tech, telefono: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Fecha nacimiento</label>
                    <input type="date" className="form-control" value={modal.tech.fecha_nacimiento?.slice(0,10)} onChange={e => setModal(m => ({...m, tech: {...m.tech, fecha_nacimiento: e.target.value}}))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Género</label>
                    <select className="form-select" value={modal.tech.genero} onChange={e => setModal(m => ({...m, tech: {...m.tech, genero: e.target.value}}))}>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success mt-2"><i className="bi bi-save me-2"></i>Guardar</button>
                </form>
              )}
              {modal.mode === "eliminar" && (
                <div>
                  <p>¿Seguro que deseas eliminar al técnico <strong>{modal.tech.nombre} {modal.tech.apellido}</strong>?</p>
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
