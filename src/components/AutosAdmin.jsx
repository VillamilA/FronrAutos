import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL;

export default function AutosAdmin() {
  const token = useSelector((state) => state.auth.token);
  const [autos, setAutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ open: false, mode: null, auto: null });
  // Mover estos hooks al inicio para cumplir reglas de hooks
  const [showCreate, setShowCreate] = useState(false);
  const [nuevoAuto, setNuevoAuto] = useState({ marca: '', modelo: '', placa: '', color: '', anio: '' });

  useEffect(() => {
    const fetchAutos = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/vehiculos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAutos(res.data);
        setError("");
      } catch (err) {
        setError("No se pudieron cargar los autos");
      }
      setLoading(false);
    };
    fetchAutos();
  }, [token]);

  // Modal handlers
  const handleVer = (auto) => setModal({ open: true, mode: "ver", auto });
  const handleEditar = (auto) => setModal({ open: true, mode: "editar", auto: { ...auto } });
  const handleEliminar = (auto) => setModal({ open: true, mode: "eliminar", auto });
  const closeModal = () => setModal({ open: false, mode: null, auto: null });

  // Actualizar auto
  const handleUpdate = async (e) => {
    e.preventDefault();
    const a = modal.auto;
    if (!a.marca || !a.modelo || !a.placa) {
      alert("Todos los campos son obligatorios");
      return;
    }
    try {
      const payload = {
        marca: a.marca,
        modelo: a.modelo,
        placa: a.placa,
        color: a.color,
        anio: a.anio
      };
      const res = await axios.put(`${API_URL}/vehiculos/${a._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAutos(autos.map(x => x._id === a._id ? res.data : x));
      closeModal();
    } catch (err) {
      alert(err.response?.data?.error || "Error al actualizar auto");
    }
  };

  // Eliminar auto
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/vehiculos/${modal.auto._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAutos(autos.filter(x => x._id !== modal.auto._id));
      closeModal();
    } catch (err) {
      alert("Error al eliminar auto");
    }
  };

  if (loading) return <div className="text-center my-5">Cargando autos...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nuevoAuto.marca || !nuevoAuto.modelo || !nuevoAuto.placa) {
      alert('Marca, modelo y placa son obligatorios');
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/vehiculos`, nuevoAuto, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAutos([...autos, res.data]);
      setShowCreate(false);
      setNuevoAuto({ marca: '', modelo: '', placa: '', color: '', anio: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Error al crear auto');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4><i className="bi bi-car-front-fill text-primary me-2"></i>Lista de Autos</h4>
        <button className="btn btn-success" onClick={() => setShowCreate(v => !v)}><i className="bi bi-plus-lg me-1"></i>Nuevo auto</button>
      </div>
      {showCreate && (
        <form className="bg-light p-3 rounded mb-4" onSubmit={handleCreate}>
          <div className="row g-2">
            <div className="col-md-2"><input className="form-control" placeholder="Marca" value={nuevoAuto.marca} onChange={e => setNuevoAuto(a => ({...a, marca: e.target.value}))} required /></div>
            <div className="col-md-2"><input className="form-control" placeholder="Modelo" value={nuevoAuto.modelo} onChange={e => setNuevoAuto(a => ({...a, modelo: e.target.value}))} required /></div>
            <div className="col-md-2"><input className="form-control" placeholder="Placa" value={nuevoAuto.placa} onChange={e => setNuevoAuto(a => ({...a, placa: e.target.value}))} required /></div>
            <div className="col-md-2"><input className="form-control" placeholder="Color" value={nuevoAuto.color} onChange={e => setNuevoAuto(a => ({...a, color: e.target.value}))} /></div>
            <div className="col-md-2"><input className="form-control" placeholder="Año" value={nuevoAuto.anio} onChange={e => setNuevoAuto(a => ({...a, anio: e.target.value}))} /></div>
            <div className="col-md-2 d-flex align-items-center"><button className="btn btn-primary w-100" type="submit"><i className="bi bi-save me-1"></i>Guardar</button></div>
          </div>
        </form>
      )}
      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white rounded shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Placa</th>
              <th>Color</th>
              <th>Año</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {autos.map(auto => (
              <tr key={auto._id}>
                <td>{auto._id.slice(-6)}</td>
                <td>{auto.marca}</td>
                <td>{auto.modelo}</td>
                <td>{auto.placa}</td>
                <td>{auto.color}</td>
                <td>{auto.anio}</td>
                <td>
                  <button className="btn btn-sm btn-outline-info me-2" title="Ver" onClick={() => handleVer(auto)}><i className="bi bi-eye"></i></button>
                  <button className="btn btn-sm btn-outline-warning me-2" title="Editar" onClick={() => handleEditar(auto)}><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={() => handleEliminar(auto)}><i className="bi bi-trash"></i></button>
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
                  {modal.mode === "ver" && <><i className="bi bi-eye me-2"></i>Detalle del Auto</>}
                  {modal.mode === "editar" && <><i className="bi bi-pencil me-2"></i>Editar Auto</>}
                  {modal.mode === "eliminar" && <><i className="bi bi-trash me-2"></i>Eliminar Auto</>}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {modal.mode === "ver" && (
                  <div>
                    <div><strong>Marca:</strong> {modal.auto.marca}</div>
                    <div><strong>Modelo:</strong> {modal.auto.modelo}</div>
                    <div><strong>Placa:</strong> {modal.auto.placa}</div>
                    <div><strong>Color:</strong> {modal.auto.color}</div>
                    <div><strong>Año:</strong> {modal.auto.anio}</div>
                  </div>
                )}
                {modal.mode === "editar" && (
                  <form onSubmit={handleUpdate}>
                    <div className="mb-2">
                      <label className="form-label">Marca</label>
                      <input className="form-control" value={modal.auto.marca} onChange={e => setModal(m => ({...m, auto: {...m.auto, marca: e.target.value}}))} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Modelo</label>
                      <input className="form-control" value={modal.auto.modelo} onChange={e => setModal(m => ({...m, auto: {...m.auto, modelo: e.target.value}}))} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Placa</label>
                      <input className="form-control" value={modal.auto.placa} onChange={e => setModal(m => ({...m, auto: {...m.auto, placa: e.target.value}}))} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Color</label>
                      <input className="form-control" value={modal.auto.color} onChange={e => setModal(m => ({...m, auto: {...m.auto, color: e.target.value}}))} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Año</label>
                      <input className="form-control" value={modal.auto.anio} onChange={e => setModal(m => ({...m, auto: {...m.auto, anio: e.target.value}}))} />
                    </div>
                    <button type="submit" className="btn btn-success mt-2"><i className="bi bi-save me-2"></i>Guardar</button>
                  </form>
                )}
                {modal.mode === "eliminar" && (
                  <div>
                    <p>¿Seguro que deseas eliminar el auto <strong>{modal.auto.marca} {modal.auto.modelo}</strong>?</p>
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
