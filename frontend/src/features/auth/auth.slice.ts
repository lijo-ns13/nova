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
  isSubscriptionActive: boolean;
  subscriptionStartDate: Date | null;
  subscriptionEndDate: Date | null;
  subscriptionCancelled: boolean;
  appliedJobCount: number;
  createdPostCount: number;
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
  isSubscriptionActive: false,
  subscriptionStartDate: null,
  subscriptionEndDate: null,
  subscriptionCancelled: false,
  appliedJobCount: 0,
  createdPostCount: 0,
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
        isSubscriptionActive?: boolean;
        subscriptionStartDate?: string | Date | null;
        subscriptionEndDate?: string | Date | null;
        subscriptionCancelled?: boolean;
        appliedJobCount?: number;
        createdPostCount?: number;
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
      state.isSubscriptionActive = action.payload.isSubscriptionActive ?? false;
      state.subscriptionStartDate = action.payload.subscriptionStartDate
        ? new Date(action.payload.subscriptionStartDate)
        : null;
      state.subscriptionEndDate = action.payload.subscriptionEndDate
        ? new Date(action.payload.subscriptionEndDate)
        : null;
      state.subscriptionCancelled =
        action.payload.subscriptionCancelled ?? false;
      state.appliedJobCount = action.payload.appliedJobCount;
      state.createdPostCount = action.payload.createdPostCount;
    },
    logout: (state) => {
      Object.assign(state, {
        ...initialState,
        isAuthenticated: false,
      });
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
        isSubscriptionActive: boolean;
        subscriptionStartDate?: string | Date | null;
        subscriptionEndDate?: string | Date | null;
        subscriptionCancelled?: boolean;
      }>
    ) => {
      state.isSubscriptionActive = action.payload.isSubscriptionActive;
      state.subscriptionStartDate = action.payload.subscriptionStartDate
        ? new Date(action.payload.subscriptionStartDate)
        : null;
      state.subscriptionEndDate = action.payload.subscriptionEndDate
        ? new Date(action.payload.subscriptionEndDate)
        : null;
      state.subscriptionCancelled =
        action.payload.subscriptionCancelled ?? false;
    },
    updateAppliedJobCount: (state, action: PayloadAction<number>) => {
      state.appliedJobCount = action.payload;
    },

    updateCreatePostCount: (state, action: PayloadAction<number>) => {
      state.createdPostCount = action.payload;
    },
  },
});

export const {
  login,
  logout,
  updateProfile,
  updateSubscriptionStatus,
  updateAppliedJobCount,
  updateCreatePostCount,
} = authSlice.actions;
export default authSlice.reducer;
