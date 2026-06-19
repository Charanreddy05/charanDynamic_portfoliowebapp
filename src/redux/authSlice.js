import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("no token");
      const res = await api.get("/auth/profile");
      return {
        user: {
          _id: res.data._id,
          fullName: res.data.fullName,
          email: res.data.email,
          role: res.data.role,
          status: res.data.status,
          permissions: res.data.permissions || [],
          profileImage: res.data.profileImage,
        },
        token,
      };
    } catch {
      localStorage.removeItem("token");
      return rejectWithValue("invalid token");
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    isLoggedIn: !!localStorage.getItem("token"),
    authReady: !localStorage.getItem("token"),
  },

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.authReady = true;
      localStorage.setItem("token", action.payload.token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.authReady = true;
      localStorage.removeItem("token");
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.authReady = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.authReady = true;
        localStorage.removeItem("token");
      });
  },
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
