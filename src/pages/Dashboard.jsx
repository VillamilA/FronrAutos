import React, { Component } from "react";
import { connect } from "react-redux";
import { setTickets } from "../store/ticketSlice";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import { Link } from "react-router-dom";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editStatusTicketId: null,
      newStatus: "",
    };
  }

  componentDidMount() {
    this.fetchTickets();
  }

  fetchTickets = async () => {
    try {
  const res = await axios.get(`${API_URL}/tickets`, {
        headers: {
          Authorization: `Bearer ${this.props.token ? this.props.token.trim() : ""}`,
          "Content-Type": "application/json",
        },
      });
      this.props.setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  handleEditClick = (ticketId, currentStatus) => {
    this.setState({
      editStatusTicketId: ticketId,
      newStatus: currentStatus,
    });
  };

  handleStatusChange = (e) => {
    this.setState({ newStatus: e.target.value });
  };

  handleUpdateStatus = async (ticketId) => {
    try {
      const { newStatus } = this.state;
      await axios.put(
        `${API_URL}/tickets/${ticketId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${this.props.token ? this.props.token.trim() : ""}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Update the tickets state after the status update
      this.fetchTickets();
      this.setState({
        editStatusTicketId: null,
        newStatus: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { user, tickets } = this.props;
    const { editStatusTicketId, newStatus } = this.state;

    return (
      <div className="min-vh-100 d-flex flex-column bg-light p-4">
        <h1 className="h3 mb-4">Welcome, {user?.username}</h1>
        <div className="d-flex justify-content-around mb-4">
          {/* Show "Create New Ticket" button only for admins */}
          {(user?.role === "admin" || user?.role === "user") && (
            <Link to="/create-ticket" className="btn btn-primary">
              Create New Ticket
            </Link>
          )}
          <Link to="/login" className="btn btn-link">Logout</Link>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="h4 mb-4">Your Tickets</h2>
          <ul className="list-unstyled">
            {tickets.map((ticket) => (
              <li key={ticket._id} className="mb-3 p-3 border rounded bg-light">
                <h3 className="h5">{ticket.title}</h3>
                <p className="text-muted">{ticket.description}</p>
                <span
                  className={`badge py-2 ${
                    ticket.status === "Open"
                      ? "bg-success"
                      : ticket.status === "In Progress"
                      ? "bg-warning"
                      : "bg-danger"
                  }`}
                >
                  Status: {ticket.status}
                </span>

                {this.state.editStatusTicketId === ticket._id ? (
                  <div className="mt-2">
                    <select
                      value={newStatus}
                      onChange={this.handleStatusChange}
                      className="form-select"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <button
                      onClick={() => this.handleUpdateStatus(ticket._id)}
                      className="ml-2 btn btn-success my-2"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => this.handleEditClick(ticket._id, ticket.status)}
                    className="m-2 btn btn-warning py-1"
                  >
                    Edit Status
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  tickets: state.tickets.tickets,
  token: state.auth.token,
});

export default connect(mapStateToProps, { setTickets })(Dashboard);