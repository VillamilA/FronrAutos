import { createSlice } from "@reduxjs/toolkit";

// Cargar estado inicial desde localStorage si existe, evitando errores de 'undefined'
let userFromStorage = localStorage.getItem("user");
let tokenFromStorage = localStorage.getItem("token");
if (userFromStorage === "undefined" || userFromStorage === null) {
  localStorage.removeItem("user");
  userFromStorage = null;
}
if (tokenFromStorage === "undefined" || tokenFromStorage === null) {
  localStorage.removeItem("token");
  tokenFromStorage = null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    token: tokenFromStorage || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;