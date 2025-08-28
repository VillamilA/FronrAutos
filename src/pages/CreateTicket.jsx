import React, { Component } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import withRouter from "../utils/withRouter";
import { connect } from "react-redux";


class CreateTicket extends Component {
  state = {
    title: "",
    description: "",
    error: "",
    cliente: "",
    clientes: [],
    loadingClientes: false
  };

  componentDidMount() {
    // Si es admin, cargar clientes
    if (this.props.user?.role === "admin") {
      this.setState({ loadingClientes: true });
      axios.get(`${API_URL}/clients`, {
        headers: { Authorization: `Bearer ${this.props.token}` }
      })
        .then(res => {
          this.setState({ clientes: res.data, loadingClientes: false });
        })
        .catch(() => {
          this.setState({ error: "No se pudieron cargar los clientes", loadingClientes: false });
        });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, cliente } = this.state;
    // Si es admin, cliente es obligatorio
    if (this.props.user?.role === "admin" && !cliente) {
      this.setState({ error: "Selecciona un cliente para el ticket" });
      return;
    }
    try {
      const payload = { title, description };
      if (this.props.user?.role === "admin") payload.cliente = cliente;
      await axios.post(
        `${API_URL}/tickets`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.props.token ? this.props.token.trim() : ""}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Redirigir según el rol
      if (this.props.user?.role === "admin") {
        this.props.navigate("/dashboard/admin/tickets");
      } else if (this.props.user?.role === "tecnico") {
        this.props.navigate("/dashboard/tecnico");
      } else {
        this.props.navigate("/dashboard/cliente");
      }
    } catch (err) {
      console.error("Error creating ticket:", err.response?.data || err);
      this.setState({ error: err.response?.data?.message || "Failed to create ticket" });
    }
  };

  render() {
    const { title, description, error, cliente, clientes, loadingClientes } = this.state;
    const isAdmin = this.props.user?.role === "admin";
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-start" style={{background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', paddingTop: 0, paddingBottom: 0}}>
        <div className="w-100" style={{maxWidth: 540, marginTop: '32px'}}>
          <div className="text-center mb-2" style={{marginBottom: '12px'}}>
            <img src="https://cdn-icons-png.flaticon.com/512/5957/5957766.png" alt="Crear Ticket" width="60" height="60" className="mb-1" style={{marginBottom:'6px'}} />
            <h2 className="fw-bold mb-1" style={{fontSize:'1.7rem'}}><i className="bi bi-plus-circle me-2 text-primary"></i>Crear Ticket</h2>
            <p className="text-muted mb-0" style={{fontSize:'1rem'}}>Describe tu problema o requerimiento y nuestro equipo te ayudará.</p>
          </div>
          <form
            onSubmit={this.handleSubmit}
            className="bg-white p-4 rounded shadow"
            style={{boxSizing:'border-box'}}
          >
            <button
              type="button"
              className="btn btn-outline-secondary mb-3"
              onClick={() => this.props.navigate(-1)}
            >
              <i className="bi bi-arrow-left me-2"></i>Regresar
            </button>

            {error && (
              <div className="mb-4 p-2 bg-danger text-white rounded text-center">
                {error}
              </div>
            )}

            {isAdmin && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Seleccionar Cliente</label>
                {loadingClientes ? (
                  <div className="form-control bg-light text-muted">Cargando clientes...</div>
                ) : (
                  <select
                    className="form-select border-primary shadow-sm"
                    value={cliente}
                    onChange={e => this.setState({ cliente: e.target.value })}
                    required
                  >
                    <option value="">-- Selecciona un cliente --</option>
                    {clientes.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.nombre} {c.apellido} - Cédula: {c.cedula}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-semibold">Título</label>
              <input
                type="text"
                placeholder="Título del ticket"
                value={title}
                onChange={(e) => this.setState({ title: e.target.value })}
                className="form-control border-primary shadow-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Descripción</label>
              <textarea
                placeholder="Describe el problema o requerimiento"
                value={description}
                onChange={(e) => this.setState({ description: e.target.value })}
                className="form-control border-primary shadow-sm"
                rows="5"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold shadow-sm"
              style={{fontSize: '1.1rem'}}
            >
              <i className="bi bi-send me-2"></i>Crear Ticket
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
});

export default connect(mapStateToProps)(withRouter(CreateTicket));