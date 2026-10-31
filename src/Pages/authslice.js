import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./axiosclient";



export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/register", userData);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data 
      );
    }
  }
);



export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/login", credentials);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data
      );
    }
  }
);



export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/user/check");

      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data 
      );
    }
  }
);



export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("/user/logout");

      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data 
      );
    }
  }
);



const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

    
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message 
        state.isAuthenticated = false;
        state.user = null;
      })

   

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      // ================= CHECK AUTH =================

      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })

    .addCase(checkAuth.rejected, (state) => {
    state.loading = false;
    state.user = null;
    state.isAuthenticated = false;
    state.error = null;
})
      // ================= LOGOUT =================

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;