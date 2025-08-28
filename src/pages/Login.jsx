import React, { Component } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import { connect } from "react-redux";
import { setCredentials } from "../store/authSlice";
import withRouter from "../utils/withRouter";
import { Link } from "react-router-dom"; // Import Link for navigation

class Login extends Component {
  state = {
    email: "",
    password: "",
    error: "", // Add error state
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const token = res.data.token;
      let user = res.data.user;

      // Si no es admin, obtener nombre y apellido del perfil
      if (user.rol !== "admin") {
        try {
          const profileRes = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const profile = profileRes.data;
          user = { ...user, nombre: profile.nombre, apellido: profile.apellido };
        } catch (e) {
          // Si falla, igual seguimos con el login
        }
      } else {
        // Para admin, si no tiene nombre, usar email como nombre
        if (!user.nombre) user.nombre = user.email;
      }

      // Save token and user data in Redux store
      this.props.setCredentials({ user, token });

      // Redirigir según rol
      const rol = user?.rol || res.data.rol;
      if (rol === "admin") {
        this.props.navigate("/dashboard/admin");
      } else if (rol === "trabajador") {
        this.props.navigate("/dashboard/trabajador");
      } else {
        this.props.navigate("/dashboard/cliente");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        const msg = err.response.data.message;
        if (msg.toLowerCase().includes("verificar tu correo")) {
          this.props.navigate(`/verificar-correo?email=${encodeURIComponent(this.state.email)}`);
        } else {
          this.setState({ error: msg });
        }
      } else if (err.response && err.response.status === 400) {
        this.setState({ error: "Usuario o contraseña incorrectos" });
      } else {
        this.setState({ error: "Ocurrió un error. Intenta de nuevo." });
      }
      console.error(err);
    }
  };

  render() {
  const { email, password, error } = this.state;

    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient" style={{background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'}}>
        <div className="card shadow-lg p-4" style={{minWidth: 350, maxWidth: 400, width: '100%'}}>
          <div className="text-center mb-4">
            <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="Login Icon" width="64" height="64" className="mb-2" />
            <h2 className="h3 fw-bold mb-1">Iniciar Sesión</h2>
            <p className="text-muted mb-0">Accede a tu cuenta para continuar</p>
          </div>
          <form onSubmit={this.handleSubmit}>
            {/* Display error message */}
            {error && (
              <div className="alert alert-danger text-center py-2 mb-3" role="alert">
                {error}
              </div>
            )}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
                className="form-control form-control-lg"
                autoFocus
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                className="form-control form-control-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 shadow-sm mt-2 mb-2"
            >
              Ingresar
            </button>
            <div className="text-center mt-2">
              <span className="text-muted">¿No tienes cuenta? </span>
              <Link to="/signup" className="fw-semibold text-decoration-none">
                Regístrate
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(null, { setCredentials })(withRouter(Login));