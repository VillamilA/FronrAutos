import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import ticketReducer from "./ticketSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
  },
});