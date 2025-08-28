

import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validatePersonaFields } from "../utils/validatePersona";


const API_URL = import.meta.env.VITE_API_URL;

export default function AddTech() {
	const navigate = useNavigate();
	const token = useSelector((state) => state.auth.token);
	const user = useSelector((state) => state.auth.user);
	const [form, setForm] = useState({
		email: "",
		password: "",
		cedula: "",
		nombre: "",
		apellido: "",
		fecha_nacimiento: "",
		genero: "",
		direccion: "",
		telefono: "",
		rol: "tecnico"
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);
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
			setLoading(false);
			return;
		}
			try {
				await axios.post(
					`${API_URL}/technicians/register`,
					{
						...form,
						role: form.rol
					},
					{
						headers: { Authorization: `Bearer ${token}` }
					}
				);
				// Si es técnico y el usuario autenticado es técnico, mostrar mensaje especial
				if (form.rol === "tecnico") {
					const userRole = JSON.parse(localStorage.getItem("user"))?.role;
					if (userRole === "tecnico") {
						setSuccess("Técnico creado, espera la aprobación de tu admin.");
					} else {
						setSuccess("Técnico creado correctamente.");
					}
				} else {
					setSuccess("Administrador creado correctamente.");
				}
				setForm({
					email: "",
					password: "",
					cedula: "",
					nombre: "",
					apellido: "",
					fecha_nacimiento: "",
					genero: "",
					direccion: "",
					telefono: "",
					rol: "tecnico"
				});
			} catch (err) {
				setError(
					err.response?.data?.message || "Error al crear técnico/administrador"
				);
			}
			setLoading(false);
		};

	// Mostrar campos solo si es técnico
	const isTech = form.rol === "tecnico";

			return (
				<div className="container py-4">
					<div className="d-flex align-items-center mb-4">
						<i
							className={`bi ${isTech ? "bi-person-badge" : "bi-person-gear"} text-success me-3`}
							style={{ fontSize: 36 }}
						></i>
						<h3 className="mb-0">
							{isTech ? "Crear Técnico" : "Crear Administrador"}
						</h3>
					</div>
					<button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
						<i className="bi bi-arrow-left me-2"></i>Regresar
					</button>
					{error && (
						<div className="alert alert-danger d-flex align-items-center">
							<i className="bi bi-exclamation-triangle me-2"></i> {error}
						</div>
					)}
					{success && (
						<div className="alert alert-success d-flex align-items-center">
							<i className="bi bi-check-circle me-2"></i> {success}
						</div>
					)}
					<form onSubmit={handleSubmit} className="row g-3 bg-white p-4 rounded shadow-sm">
						<div className="col-md-6">
							<label className="form-label">
								<i className="bi bi-envelope-at me-2"></i>Email
							</label>
							<input
								type="email"
								className="form-control"
								name="email"
								value={form.email}
								onChange={handleChange}
								required
								autoComplete="off"
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label">
								<i className="bi bi-key me-2"></i>Contraseña
							</label>
							<input
								type="password"
								className="form-control"
								name="password"
								value={form.password}
								onChange={handleChange}
								required
								autoComplete="new-password"
							/>
						</div>
						{isTech && (
							<>
								<div className="col-md-4">
									<label className="form-label">
										<i className="bi bi-credit-card-2-front me-2"></i>Cédula
									</label>
									<input
										type="text"
										className="form-control"
										name="cedula"
										value={form.cedula}
										onChange={handleChange}
										required={isTech}
									/>
								</div>
								<div className="col-md-4">
									<label className="form-label">
										<i className="bi bi-person me-2"></i>Nombre
									</label>
									<input
										type="text"
										className="form-control"
										name="nombre"
										value={form.nombre}
										onChange={handleChange}
										required={isTech}
									/>
								</div>
								<div className="col-md-4">
									<label className="form-label">
										<i className="bi bi-person me-2"></i>Apellido
									</label>
									<input
										type="text"
										className="form-control"
										name="apellido"
										value={form.apellido}
										onChange={handleChange}
										required={isTech}
									/>
								</div>
								<div className="col-md-4">
									<label className="form-label">
										<i className="bi bi-calendar-date me-2"></i>Fecha de nacimiento
									</label>
									<input
										type="date"
										className="form-control"
										name="fecha_nacimiento"
										value={form.fecha_nacimiento}
										onChange={handleChange}
										required={isTech}
									/>
								</div>
								<div className="col-md-4">
									<label className="form-label">
										<i className="bi bi-gender-ambiguous me-2"></i>Género
									</label>
									<select
										className="form-select"
										name="genero"
										value={form.genero}
										onChange={handleChange}
										required={isTech}
									>
										<option value="">Selecciona</option>
										<option value="masculino">Masculino</option>
										<option value="femenino">Femenino</option>
										<option value="otro">Otro</option>
									</select>
								</div>
								<div className="col-md-4">
									<label className="form-label">
										<i className="bi bi-geo-alt me-2"></i>Dirección
									</label>
									<input
										type="text"
										className="form-control"
										name="direccion"
										value={form.direccion}
										onChange={handleChange}
										required={isTech}
									/>
								</div>
								<div className="col-md-4">
									<label className="form-label">
										<i className="bi bi-telephone me-2"></i>Teléfono
									</label>
									<input
										type="text"
										className="form-control"
										name="telefono"
										value={form.telefono}
										onChange={handleChange}
										required={isTech}
									/>
								</div>
							</>
						)}
						<div className="col-md-4">
							<label className="form-label">
								<i className="bi bi-person-gear me-2"></i>Rol
							</label>
										<select
											className="form-select"
											name="rol"
											value={form.rol}
											onChange={handleChange}
											required
										>
											<option value="tecnico">Técnico</option>
											{user?.role === "admin" && <option value="admin">Administrador</option>}
										</select>
						</div>
						<div className="col-12 mt-3">
							<button
								type="submit"
								className="btn btn-success px-4 py-2 shadow-sm"
								disabled={loading}
							>
								<i className="bi bi-plus-circle me-2"></i>
								{loading
									? "Creando..."
									: isTech
									? "Crear Técnico"
									: "Crear Administrador"}
							</button>
						</div>
					</form>
				</div>
			);
		}
