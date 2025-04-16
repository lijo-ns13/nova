import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of your state
interface AuthState {
  isAuthenticated: boolean;
  id: string;
  name: string;
  headline: string;
  email: string;
  role: string;
  profilePicture: string;
  isVerified: boolean;
  isBlocked: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  id: "",
  name: "",
  email: "",
  role: "",
  profilePicture: "",
  headline: "",
  isVerified: false,
  isBlocked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        email: string;
        role: string;
        profilePicture?: string;
        headline?: string;
        isVerified: boolean;
        isBlocked: boolean;
      }>
    ) => {
      state.isAuthenticated = true;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.profilePicture = action.payload.profilePicture ?? ""; // fallback if undefined
      state.headline = action.payload.headline ?? ""; // fallback if undefined
      state.isVerified = action.payload.isVerified;
      state.isBlocked = action.payload.isBlocked;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.id = "";
      state.name = "";
      state.email = "";
      state.role = "";
      state.profilePicture = "";
      state.headline = "";
      state.isBlocked = false;
      state.isVerified = false;
    },
    updateProfile: (
      state,
      action: PayloadAction<{
        name?: string;
        headline?: string;
        profilePicture?: string;
      }>
    ) => {
      if (action.payload.name) state.name = action.payload.name;
      if (action.payload.headline) state.headline = action.payload.headline;
      if (action.payload.profilePicture !== undefined) {
        state.profilePicture = action.payload.profilePicture;
      }
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
