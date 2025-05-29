import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "../features/auth/auth.slice";
import chatReducer from "./slice/chatSlice";
import notificationReducer from "./slice/notificationSlice";
// Combine reducers if you have more in the future
const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  notification: notificationReducer,
});

// Redux Persist config
const persistConfig = {
  key: "root", // key in localStorage
  storage, // you can switch to sessionStorage if needed
  whitelist: ["auth"], // reducers you want to persist (you can be specific here)
};

// Wrap your rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist uses non-serializable things internally
    }),
  devTools: true,
});

// Create the persistor
export const persistor = persistStore(store);

// Export types for usage in hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
