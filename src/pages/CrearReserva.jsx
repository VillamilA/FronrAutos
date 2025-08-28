import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;


export default function CrearReserva() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Obtener vehículos disponibles
    axios.get(`${API_URL}/vehiculos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setVehiculos(res.data))
      .catch(() => setError("No se pudieron cargar los vehículos"));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!descripcion.trim()) {
      setError("La descripción es obligatoria");
      return;
    }
    if (!vehiculoSeleccionado) {
      setError("Debes seleccionar un vehículo");
      return;
    }
    if (!fechaInicio || !fechaFin) {
      setError("Debes seleccionar la fecha de inicio y fin de la reserva");
      return;
    }
    // Validar fechas
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fechaIni = new Date(fechaInicio);
    const fechaF = new Date(fechaFin);
    if (fechaIni < hoy) {
      setError("La fecha de inicio no puede ser anterior a hoy");
      return;
    }
    if (fechaF < fechaIni) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio");
      return;
    }
    setLoading(true);
    const payload = {
      descripcion,
      cliente: user?._id,
      vehiculo: vehiculoSeleccionado,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    };
    try {
      await axios.post(`${API_URL}/reserva`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSuccess("Reserva creada exitosamente");
      setTimeout(() => navigate("/dashboard/cliente/reservas"), 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  const handleVehiculoChange = (e) => {
    setVehiculoSeleccionado(e.target.value);
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-start" style={{background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', paddingTop: 0, paddingBottom: 0}}>
      <div className="w-100" style={{maxWidth: 540, marginTop: '32px'}}>
        <div className="text-center mb-2" style={{marginBottom: '12px'}}>
          <img src="https://cdn-icons-png.flaticon.com/512/5957/5957766.png" alt="Crear Reserva" width="60" height="60" className="mb-1" style={{marginBottom:'6px'}} />
          <h2 className="fw-bold mb-1" style={{fontSize:'1.7rem'}}><i className="bi bi-calendar-plus me-2 text-success"></i>Reservar Auto</h2>
          <p className="text-muted mb-0" style={{fontSize:'1rem'}}>Selecciona el/los autos y describe tu necesidad.</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow"
          style={{boxSizing:'border-box'}}
        >
          <button
            type="button"
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2"></i>Regresar
          </button>

          {error && (
            <div className="mb-4 p-2 bg-danger text-white rounded text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-2 bg-success text-white rounded text-center">
              {success}
            </div>
          )}


          <div className="mb-3">
            <label className="form-label fw-semibold">Seleccionar Vehículo</label>
            <select className="form-select" value={vehiculoSeleccionado} onChange={handleVehiculoChange} required>
              <option value="">-- Selecciona un vehículo --</option>
              {vehiculos.map(v => (
                <option key={v._id} value={v._id}>{v.marca} {v.modelo} ({v.placa})</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Fecha de inicio</label>
            <input
              type="date"
              className="form-control"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Fecha de fin</label>
            <input
              type="date"
              className="form-control"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              min={fechaInicio || new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Descripción</label>
            <textarea
              placeholder="Describe el motivo de la reserva"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="form-control border-primary shadow-sm"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-bold shadow-sm"
            style={{fontSize: '1.1rem'}}
            disabled={loading}
          >
            <i className="bi bi-send me-2"></i>{loading ? "Reservando..." : "Reservar Auto"}
          </button>
        </form>
      </div>
    </div>
  );
}
