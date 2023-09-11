import { createSlice } from "@reduxjs/toolkit";

const userFromStorage = localStorage.getItem("user") || null;
const user =
  typeof userFromStorage === "string"
    ? JSON.parse(userFromStorage)
    : userFromStorage;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: JSON.parse(localStorage.getItem("access")) || null,
    isAuthenticated: localStorage.getItem("access") ? true : false,
    user: user,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("access");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setToken, clearToken, setUser } = authSlice.actions;
export default authSlice.reducer;
