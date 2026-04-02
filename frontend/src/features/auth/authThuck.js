import { createAsyncThunk } from "@reduxjs/toolkit";
import backendApi from "../../utils/axiosInstance";
import { handleError } from "../../utils/handleError";

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await backendApi.post("/auth/register", userData);
      return res.data;
    } catch (err) {
      console.log("Error", err);
      
      // Handle 500 server errors with user-friendly message
      if (err.response?.status === 500) {
        const errorMessage = err.response?.data?.message || 
                            err.response?.data?.error || 
                            "Server error. Please try again later or contact support.";
        return rejectWithValue(errorMessage);
      }
      
      const fullError = handleError(err);
      return rejectWithValue(fullError.message || "Signup failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await backendApi.post("/auth/login", userData);

      return res.data;
    } catch (err) {
      console.log("Error", err);
      
      // Handle 500 server errors with user-friendly message
      if (err.response?.status === 500) {
        const errorMessage = err.response?.data?.message || 
                            err.response?.data?.error || 
                            "Server error. Please try again later or contact support.";
        return rejectWithValue(errorMessage);
      }
      
      const fullError = handleError(err);
      return rejectWithValue(fullError.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await backendApi.post("/auth/logout");
      return true;
    } catch (err) {
      console.log("Error", err);
      
      // Handle 500 server errors with user-friendly message
      if (err.response?.status === 500) {
        const errorMessage = err.response?.data?.message || 
                            err.response?.data?.error || 
                            "Server error. Please try again later or contact support.";
        return rejectWithValue(errorMessage);
      }
      
      const fullError = handleError(err);
      return rejectWithValue(fullError.message || "Logout failed");
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await backendApi.get("/auth", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      console.log("Error", err);

      // Handle 500 server errors with user-friendly message
      if (err.response?.status === 500) {
        const errorMessage = err.response?.data?.message || 
                            err.response?.data?.error || 
                            "Server error. Please try again later or contact support.";
        return rejectWithValue(errorMessage);
      }

      const fullError = handleError(err);
      return rejectWithValue(fullError.message || "Fetching user failed");
    }
  }
);
