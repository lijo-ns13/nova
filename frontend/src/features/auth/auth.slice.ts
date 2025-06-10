import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of your state
interface AuthState {
  isAuthenticated: boolean;
  id: string;
  name: string;
  username: string;
  headline: string;
  email: string;
  role: string;
  profilePicture: string;
  isVerified: boolean;
  isBlocked: boolean;
  isSubscriptionTaken: boolean;
  subscriptionExpiresAt?: Date;
}

const initialState: AuthState = {
  isAuthenticated: false,
  id: "",
  username: "",
  name: "",
  email: "",
  role: "",
  profilePicture: "",
  headline: "",
  isVerified: false,
  isBlocked: false,
  isSubscriptionTaken: false,
  subscriptionExpiresAt: undefined,
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
        username?: string;
        email: string;
        role: string;
        profilePicture?: string;
        headline?: string;
        isVerified: boolean;
        isBlocked: boolean;
        isSubscriptionTaken?: boolean;
        subscriptionExpiresAt?: string | Date;
      }>
    ) => {
      state.isAuthenticated = true;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.username = action.payload.username ?? "";
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.profilePicture = action.payload.profilePicture ?? ""; // fallback if undefined
      state.headline = action.payload.headline ?? ""; // fallback if undefined
      state.isVerified = action.payload.isVerified;
      state.isBlocked = action.payload.isBlocked;
      state.isSubscriptionTaken = action.payload.isSubscriptionTaken ?? false;
      state.subscriptionExpiresAt = action.payload.subscriptionExpiresAt
        ? new Date(action.payload.subscriptionExpiresAt)
        : undefined;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.id = "";
      state.name = "";
      state.username = "";
      state.email = "";
      state.role = "";
      state.profilePicture = "";
      state.headline = "";
      state.isBlocked = false;
      state.isVerified = false;
      state.isSubscriptionTaken = false;
      state.subscriptionExpiresAt = undefined;
    },
    updateProfile: (
      state,
      action: PayloadAction<{
        name?: string;
        headline?: string;
        profilePicture?: string;
        username?: string;
      }>
    ) => {
      if (action.payload.name) state.name = action.payload.name;
      if (action.payload.username) state.username = action.payload.username;
      if (action.payload.headline) state.headline = action.payload.headline;
      if (action.payload.profilePicture !== undefined) {
        state.profilePicture = action.payload.profilePicture;
      }
    },
    updateSubscriptionStatus: (
      state,
      action: PayloadAction<{
        isSubscriptionTaken: boolean;
        subscriptionExpiresAt?: string | Date;
      }>
    ) => {
      state.isSubscriptionTaken = action.payload.isSubscriptionTaken;
      state.subscriptionExpiresAt = action.payload.subscriptionExpiresAt
        ? new Date(action.payload.subscriptionExpiresAt)
        : undefined;
    },
  },
});

export const { login, logout, updateProfile, updateSubscriptionStatus } =
  authSlice.actions;
export default authSlice.reducer;
