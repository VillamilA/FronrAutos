
import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setCredentials } from "../store/authSlice";

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_PHOTO = "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=128";

export default function PerfilAdmin() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // Simulación de foto de perfil (en real, sería un campo en la BD)
  const [photo, setPhoto] = useState(localStorage.getItem("admin_photo") || DEFAULT_PHOTO);
  const fileInput = useRef();

  // Formulario de edición
  const [form, setForm] = useState({
    email: user?.email || "",
    password: "",
    nombre: user?.nombre || "Administrador",
    telefono: user?.telefono || "",
    ciudad: user?.ciudad || "",
  });

  // Simulación de guardar foto localmente
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      localStorage.setItem("admin_photo", ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      // Solo permite cambiar email y/o password y datos simulados
      const payload = { email: form.email };
      if (form.password) payload.password = form.password;
      // Simulación: nombre, telefono, ciudad solo frontend
      const res = await axios.put(`${API_URL}/users/${user._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setCredentials({ user: { ...res.data, ...form }, token }));
      setMsg("Perfil actualizado correctamente");
      setModal(false);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error al actualizar perfil");
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{maxWidth: 520}}>
      <h3 className="mb-4"><i className="bi bi-person-circle me-2"></i>Mi Perfil (Admin)</h3>
      <div className="card shadow p-4 position-relative" style={{borderRadius: 24, background: '#f8f9fa'}}>
        <div className="d-flex flex-column align-items-center mb-4">
          <div className="position-relative mb-2">
            <img src={photo} alt="Foto perfil" className="rounded-circle border border-3 border-primary" style={{width: 110, height: 110, objectFit: 'cover', background: '#e0eafc'}} />
            <button className="btn btn-sm btn-light position-absolute bottom-0 end-0 border shadow" style={{borderRadius: '50%'}} onClick={() => fileInput.current.click()} title="Cambiar foto">
              <i className="bi bi-camera"></i>
            </button>
            <input type="file" accept="image/*" ref={fileInput} style={{display:'none'}} onChange={handlePhotoChange} />
          </div>
          <h4 className="fw-bold mb-0">{form.nombre}</h4>
          <span className="text-muted">Administrador</span>
        </div>
        <div className="row g-3 mb-2">
          <div className="col-12">
            <label className="form-label mb-0">Email</label>
            <input className="form-control bg-light text-secondary" value={form.email} disabled />
          </div>
          <div className="col-6">
            <label className="form-label mb-0">Teléfono</label>
            <input className="form-control bg-light text-secondary" value={form.telefono} disabled />
          </div>
          <div className="col-6">
            <label className="form-label mb-0">Ciudad</label>
            <input className="form-control bg-light text-secondary" value={form.ciudad} disabled />
          </div>
        </div>
        <button className="btn btn-primary w-100 mt-3" onClick={() => setModal(true)}><i className="bi bi-pencil me-2"></i>Editar perfil</button>
      </div>
      {/* Modal flotante para editar */}
      {modal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{background: 'rgba(0,0,0,0.3)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="bi bi-pencil me-2"></i>Editar Perfil</h5>
                <button type="button" className="btn-close" onClick={() => setModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="mb-3 text-center">
                  <img src={photo} alt="Foto perfil" className="rounded-circle border border-2 border-primary" style={{width: 80, height: 80, objectFit: 'cover'}} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" name="email" value={form.email} disabled style={{background:'#f1f1f1', color:'#888'}} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input className="form-control" name="telefono" value={form.telefono} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ciudad</label>
                  <input className="form-control" name="ciudad" value={form.ciudad} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nueva contraseña (opcional)</label>
                  <input className="form-control" name="password" type="password" value={form.password} onChange={handleChange} />
                </div>
                <button className="btn btn-success w-100" type="submit" disabled={loading}><i className="bi bi-save me-2"></i>Guardar cambios</button>
              </form>
            </div>
          </div>
        </div>
      )}
      {msg && <div className={`alert mt-3 ${msg.includes('correctamente') ? 'alert-success' : 'alert-danger'}`}>{msg}</div>}
    </div>
  );
}
