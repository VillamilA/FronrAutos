import React, { Component } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import withRouter from "../utils/withRouter";
import { Link } from "react-router-dom";
import { validatePersonaFields } from "../utils/validatePersona";


class Signup extends Component {
  state = {
    cedula: "",
    nombre: "",
    apellido: "",
    ciudad: "",
    direccion: "",
    telefono: "",
    fecha_nacimiento: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    fieldErrors: {},
    success: false,
    showVerification: false,
    verificationCode: "",
    verificationError: "",
    verificationSuccess: false,
  };

  validateFields = () => {
    const { email, password, confirmPassword, cedula, nombre, apellido, ciudad, direccion, telefono, fecha_nacimiento } = this.state;
    let fieldErrors = {};
    if (!email) fieldErrors.email = "El email es obligatorio";
    if (!password) fieldErrors.password = "La contraseña es obligatoria";
    if (!confirmPassword) fieldErrors.confirmPassword = "Debes confirmar la contraseña";
    if (!cedula) fieldErrors.cedula = "La cédula es obligatoria";
    if (!nombre) fieldErrors.nombre = "El nombre es obligatorio";
    if (!apellido) fieldErrors.apellido = "El apellido es obligatorio";
    if (!ciudad) fieldErrors.ciudad = "La ciudad es obligatoria";
    if (!direccion) fieldErrors.direccion = "La dirección es obligatoria";
    if (!telefono) fieldErrors.telefono = "El teléfono es obligatorio";
    if (!fecha_nacimiento) fieldErrors.fecha_nacimiento = "La fecha de nacimiento es obligatoria";
    // Validación centralizada
    const errorMsg = validatePersonaFields({
      nombre,
      apellido,
      cedula,
      telefono,
      fecha_nacimiento,
      email,
      password,
      confirmPassword,
      isRegister: true
    });
    if (errorMsg) {
      // Intenta asociar el error a un campo específico
      if (errorMsg.toLowerCase().includes("nombre")) fieldErrors.nombre = errorMsg;
      else if (errorMsg.toLowerCase().includes("apellido")) fieldErrors.apellido = errorMsg;
      else if (errorMsg.toLowerCase().includes("cédula") || errorMsg.toLowerCase().includes("cedula")) fieldErrors.cedula = errorMsg;
      else if (errorMsg.toLowerCase().includes("teléfono") || errorMsg.toLowerCase().includes("telefono")) fieldErrors.telefono = errorMsg;
      else if (errorMsg.toLowerCase().includes("fecha")) fieldErrors.fecha_nacimiento = errorMsg;
      else if (errorMsg.toLowerCase().includes("email")) fieldErrors.email = errorMsg;
      else if (errorMsg.toLowerCase().includes("contraseña")) fieldErrors.password = errorMsg;
      else if (errorMsg.toLowerCase().includes("coinciden")) fieldErrors.confirmPassword = errorMsg;
      else fieldErrors.general = errorMsg;
    }
    return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = this.validateFields();
    if (fieldErrors) {
      this.setState({ fieldErrors, error: fieldErrors.general || "Corrige los errores en el formulario" });
      return;
    }
    const { cedula, nombre, apellido, ciudad, direccion, telefono, fecha_nacimiento, email, password } = this.state;
    try {
      await axios.post(`${API_URL}/auth/register`, {
        cedula,
        nombre,
        apellido,
        ciudad,
        direccion,
        telefono,
        fecha_nacimiento,
        email,
        password,
        rol: "cliente"
      });
      this.setState({ success: true, error: "", fieldErrors: {}, showVerification: true });
    } catch (err) {
      // Si el backend responde con errores de validación
      if (err.response && err.response.status === 400 && err.response.data.errors) {
        // Mapear errores a los campos
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          if (e.param) fieldErrors[e.param] = e.msg;
        });
        this.setState({ fieldErrors, error: "Corrige los errores en el formulario" });
      } else if (err.response && err.response.data && err.response.data.message) {
        this.setState({ error: err.response.data.message, fieldErrors: {} });
      } else {
        this.setState({ error: "Ocurrió un error. Intenta de nuevo.", fieldErrors: {} });
      }
      console.error(err);
    }
  };

  handleVerify = async (e) => {
    e.preventDefault();
    const { email, verificationCode } = this.state;
    if (!verificationCode) {
      this.setState({ verificationError: "Ingresa el código de verificación" });
      return;
    }
    try {
      await axios.post(`${API_URL}/auth/verify-email`, {
        email,
        codigo: verificationCode
      });
      this.setState({ verificationSuccess: true, verificationError: "" });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        this.setState({ verificationError: err.response.data.message });
      } else {
        this.setState({ verificationError: "Error al verificar el código" });
      }
    }
  };

  render() {
  const { email, password, confirmPassword, cedula, nombre, apellido, ciudad, direccion, telefono, fecha_nacimiento, error, fieldErrors, success } = this.state;

    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient" style={{background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'}}>
        <div className="card shadow-lg px-5 py-4" style={{minWidth: 400, maxWidth: 650, width: '100%'}}>
          <div className="text-center mb-4">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Registro Icon" width="64" height="64" className="mb-2" />
            <h2 className="h3 fw-bold mb-1">Crear cuenta de cliente</h2>
            <p className="text-muted mb-0">Regístrate para reservar vehículos fácilmente</p>
          </div>
          {/* Flujo de verificación de correo */}
          {this.state.showVerification ? (
            <div>
              <div className="alert alert-success text-center">
                <strong>¡Registro exitoso!</strong><br/>
                Revisa tu correo para verificar tu cuenta.<br/>
                Ingresa el código de verificación enviado a tu correo.
              </div>
              {!this.state.verificationSuccess ? (
                <form onSubmit={this.handleVerify} className="mt-4">
                  {this.state.verificationError && (
                    <div className="alert alert-danger text-center py-2 mb-3" role="alert">
                      {this.state.verificationError}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Código de verificación</label>
                    <input
                      type="text"
                      placeholder="Código recibido en tu correo"
                      value={this.state.verificationCode}
                      onChange={(e) => this.setState({ verificationCode: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success w-100">Validar correo</button>
                </form>
              ) : (
                <div className="alert alert-success text-center mt-4">
                  <strong>¡Correo validado correctamente!</strong>
                  <div className="mt-3">
                    <Link to="/login" className="btn btn-primary w-100">Iniciar sesión</Link>
                  </div>
                </div>
              )}
            </div>
          ) : success ? (
            <div className="alert alert-success text-center">
              <strong>¡Registro exitoso!</strong><br/>
              Revisa tu correo para verificar tu cuenta.<br/>
              <span className="text-muted">(Próximamente aquí irá la verificación)</span>
              <div className="mt-3">
                <Link to="/login" className="btn btn-outline-primary w-100">Volver al login</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={this.handleSubmit}>
              {/* Display error message */}
              {error && (
                <div className="alert alert-danger text-center py-2 mb-3" role="alert">
                  {error}
                </div>
              )}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input type="text" placeholder="Nombres" value={nombre} onChange={(e) => this.setState({ nombre: e.target.value })} className="form-control" style={{fontSize: '1rem'}} required />
                  {fieldErrors && fieldErrors.nombre && <div className="text-danger small mt-1">{fieldErrors.nombre}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Apellido</label>
                  <input type="text" placeholder="Apellidos" value={apellido} onChange={(e) => this.setState({ apellido: e.target.value })} className="form-control" style={{fontSize: '1rem'}} required />
                  {fieldErrors && fieldErrors.apellido && <div className="text-danger small mt-1">{fieldErrors.apellido}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Cédula</label>
                  <input type="text" placeholder="Cédula (10 dígitos)" value={cedula} onChange={(e) => this.setState({ cedula: e.target.value })} className="form-control" style={{fontSize: '1rem'}} maxLength={10} required />
                  {fieldErrors && fieldErrors.cedula && <div className="text-danger small mt-1">{fieldErrors.cedula}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Ciudad</label>
                  <input type="text" placeholder="Ciudad" value={ciudad} onChange={(e) => this.setState({ ciudad: e.target.value })} className="form-control" style={{fontSize: '1rem'}} required />
                  {fieldErrors && fieldErrors.ciudad && <div className="text-danger small mt-1">{fieldErrors.ciudad}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Dirección</label>
                  <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => this.setState({ direccion: e.target.value })} className="form-control" style={{fontSize: '1rem'}} required />
                  {fieldErrors && fieldErrors.direccion && <div className="text-danger small mt-1">{fieldErrors.direccion}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Teléfono</label>
                  <input type="text" placeholder="Teléfono (10 dígitos, inicia con 09)" value={telefono} onChange={(e) => this.setState({ telefono: e.target.value })} className="form-control" style={{fontSize: '1rem'}} maxLength={10} required />
                  {fieldErrors && fieldErrors.telefono && <div className="text-danger small mt-1">{fieldErrors.telefono}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Fecha de nacimiento</label>
                  <input type="date" value={fecha_nacimiento} onChange={(e) => this.setState({ fecha_nacimiento: e.target.value })} className="form-control" style={{fontSize: '1rem'}} required />
                  {fieldErrors && fieldErrors.fecha_nacimiento && <div className="text-danger small mt-1">{fieldErrors.fecha_nacimiento}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Correo electrónico</label>
                  <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => this.setState({ email: e.target.value })} className="form-control" style={{fontSize: '1rem'}} required />
                  {fieldErrors && fieldErrors.email && <div className="text-danger small mt-1">{fieldErrors.email}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input type="password" placeholder="Contraseña" value={password} onChange={(e) => this.setState({ password: e.target.value })} className="form-control" style={{fontSize: '1rem'}} required />
                  {fieldErrors && fieldErrors.password && <div className="text-danger small mt-1">{fieldErrors.password}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Confirmar contraseña</label>
                  <input type="password" placeholder="Repite la contraseña" value={confirmPassword} onChange={(e) => this.setState({ confirmPassword: e.target.value })} className="form-control" style={{fontSize: '1rem'}} required />
                  {fieldErrors && fieldErrors.confirmPassword && <div className="text-danger small mt-1">{fieldErrors.confirmPassword}</div>}
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm mt-4 mb-2">Registrarse</button>
              <div className="text-center mt-2">
                <span className="text-muted">¿Ya tienes cuenta? </span>
                <Link to="/login" className="fw-semibold text-decoration-none">Inicia sesión</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Signup);