
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_PHOTO = "https://ui-avatars.com/api/?name=Tech&background=0D8ABC&color=fff&size=128";

export default function PerfilTecnico() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(localStorage.getItem("tech_photo") || DEFAULT_PHOTO);
  const fileInput = useRef();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
    genero: "",
    cedula: "",
    email: "",
  });

  // Al montar, buscar el perfil técnico autenticado
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const myTech = res.data;
        setForm({
          nombre: myTech.nombre || "",
          apellido: myTech.apellido || "",
          telefono: myTech.telefono || "",
          direccion: myTech.direccion || "",
          fecha_nacimiento: myTech.fecha_nacimiento ? myTech.fecha_nacimiento.slice(0,10) : "",
          genero: myTech.genero || "",
          cedula: myTech.cedula || "",
          email: myTech.email || "",
        });
      } catch (err) {
        setMsg("No se pudo cargar el perfil técnico");
      }
    };
    if (user && token) fetchProfile();
  }, [user, token]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      localStorage.setItem("tech_photo", ev.target.result);
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
      // Solo enviar campos válidos y no vacíos
      const payload = {};
      for (const key of Object.keys(form)) {
        if (form[key] !== undefined && form[key] !== "") {
          payload[key] = form[key];
        }
      }
      await axios.put(`${API_URL}/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("Perfil actualizado correctamente");
      setModal(false);
    } catch (err) {
      setMsg("Error al actualizar perfil");
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{maxWidth: 520}}>
      <h3 className="mb-4"><i className="bi bi-person-circle me-2"></i>Mi Perfil (Técnico)</h3>
      <div className="card shadow p-4 position-relative" style={{borderRadius: 24, background: '#f8f9fa'}}>
        <div className="d-flex flex-column align-items-center mb-4">
          <div className="position-relative mb-2">
            <img src={photo} alt="Foto perfil" className="rounded-circle border border-3 border-primary" style={{width: 110, height: 110, objectFit: 'cover', background: '#e0eafc'}} />
            <button className="btn btn-sm btn-light position-absolute bottom-0 end-0 border shadow" style={{borderRadius: '50%'}} onClick={() => fileInput.current.click()} title="Cambiar foto">
              <i className="bi bi-camera"></i>
            </button>
            <input type="file" accept="image/*" ref={fileInput} style={{display:'none'}} onChange={handlePhotoChange} />
          </div>
          <h4 className="fw-bold mb-0">{form.nombre} {form.apellido}</h4>
          <span className="text-muted">Técnico</span>
        </div>
        <div className="row g-3 mb-2">
          <div className="col-6">
            <label className="form-label mb-0">Nombre</label>
            <input className="form-control bg-light text-secondary" value={form.nombre} disabled />
          </div>
          <div className="col-6">
            <label className="form-label mb-0">Apellido</label>
            <input className="form-control bg-light text-secondary" value={form.apellido} disabled />
          </div>
          <div className="col-6">
            <label className="form-label mb-0">Teléfono</label>
            <input className="form-control bg-light text-secondary" value={form.telefono} disabled />
          </div>
          <div className="col-6">
            <label className="form-label mb-0">Dirección</label>
            <input className="form-control bg-light text-secondary" value={form.direccion} disabled />
          </div>
          <div className="col-6">
            <label className="form-label mb-0">Fecha nacimiento</label>
            <input className="form-control bg-light text-secondary" value={form.fecha_nacimiento} disabled />
          </div>
          <div className="col-6">
            <label className="form-label mb-0">Género</label>
            <input className="form-control bg-light text-secondary" value={form.genero} disabled />
          </div>
        </div>
        <button className="btn btn-primary w-100 mt-3" onClick={() => setModal(true)}><i className="bi bi-pencil me-2"></i>Editar perfil</button>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" name="email" value={user?.email || ''} disabled style={{background:'#f1f1f1', color:'#888'}} />
                </div>
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
                  <label className="form-label">Apellido</label>
                  <input className="form-control" name="apellido" value={form.apellido} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input className="form-control" name="telefono" value={form.telefono} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dirección</label>
                  <input className="form-control" name="direccion" value={form.direccion} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha nacimiento</label>
                  <input className="form-control" name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Género</label>
                  <select className="form-select" name="genero" value={form.genero} onChange={handleChange}>
                    <option value="">Selecciona</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
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
