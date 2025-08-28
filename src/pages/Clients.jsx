

import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validatePersonaFields } from "../utils/validatePersona";

const API_URL = import.meta.env.VITE_API_URL;

export default function Clients() {
	const navigate = useNavigate();
	const token = useSelector((state) => state.auth.token);
	const [form, setForm] = useState({
		email: "",
		password: "",
		cedula: "",
		nombre: "",
		apellido: "",
		ciudad: "",
		direccion: "",
		telefono: "",
		fecha_nacimiento: "",
		dependencia: ""
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		// Validación estricta
		const errorMsg = validatePersonaFields({
			nombre: form.nombre,
			apellido: form.apellido,
			cedula: form.cedula,
			telefono: form.telefono,
			fecha_nacimiento: form.fecha_nacimiento,
			email: form.email,
			password: form.password,
			isRegister: true
		});
		if (errorMsg) {
			setError(errorMsg);
			return;
		}
		try {
			console.log('Enviando datos:', form);
			await axios.post(`${API_URL}/clients/register`, form);
			setSuccess("Cliente creado correctamente.");
			setForm({
				email: "",
				password: "",
				cedula: "",
				nombre: "",
				apellido: "",
				ciudad: "",
				direccion: "",
				telefono: "",
				fecha_nacimiento: "",
				dependencia: ""
			});
		} catch (err) {
			console.error('Error al crear cliente:', err.response?.data || err);
			setError(err.response?.data?.message || "Error al crear cliente");
		}
	};

		return (
			<div className="container py-4">
				<h3 className="mb-4">Crear Cliente</h3>
				<button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
					<i className="bi bi-arrow-left me-2"></i>Regresar
				</button>
				{error && <div className="alert alert-danger">{error}</div>}
				{success && <div className="alert alert-success">{success}</div>}
				<form onSubmit={handleSubmit} className="row g-3">
					{/* ...campos del formulario... */}
					<div className="col-md-6">
						<label className="form-label">Email</label>
						<input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
					</div>
					<div className="col-md-6">
						<label className="form-label">Contraseña</label>
						<input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
					</div>
					<div className="col-md-4">
						<label className="form-label">Cédula</label>
						<input type="text" className="form-control" name="cedula" value={form.cedula} onChange={handleChange} required />
					</div>
					<div className="col-md-4">
						<label className="form-label">Nombre</label>
						<input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
					</div>
					<div className="col-md-4">
						<label className="form-label">Apellido</label>
						<input type="text" className="form-control" name="apellido" value={form.apellido} onChange={handleChange} required />
					</div>
					<div className="col-md-4">
						<label className="form-label">Ciudad</label>
						<input type="text" className="form-control" name="ciudad" value={form.ciudad} onChange={handleChange} required />
					</div>
					<div className="col-md-4">
						<label className="form-label">Dirección</label>
						<input type="text" className="form-control" name="direccion" value={form.direccion} onChange={handleChange} required />
					</div>
					<div className="col-md-4">
						<label className="form-label">Teléfono</label>
						<input type="text" className="form-control" name="telefono" value={form.telefono} onChange={handleChange} required />
					</div>
					<div className="col-md-4">
						<label className="form-label">Fecha de nacimiento</label>
						<input type="date" className="form-control" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} required />
					</div>
					<div className="col-md-4">
						<label className="form-label">Dependencia</label>
						<input type="text" className="form-control" name="dependencia" value={form.dependencia} onChange={handleChange} required />
					</div>
					<div className="col-12">
						<button type="submit" className="btn btn-primary">Crear</button>
					</div>
				</form>
			</div>
		);
	}
