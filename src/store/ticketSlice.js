import { createSlice } from "@reduxjs/toolkit";

const ticketSlice = createSlice({
  name: "tickets",
  initialState: { tickets: [] },
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    updateTicket: (state, action) => {
      const index = state.tickets.findIndex((ticket) => ticket._id === action.payload._id);
      state.tickets[index] = action.payload;
    },
  },
});

export const { setTickets, updateTicket } = ticketSlice.actions;
export default ticketSlice.reducer;