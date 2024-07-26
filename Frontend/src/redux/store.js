import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import snackbarReducer from './snackbarSlice';
import audioReducer from './audioplayerSlice';
import signinReducer from './setsigninSlice';
import themeReducer from './themeSlice'; 
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Configure the persist settings
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['theme'], 
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  snackbar: snackbarReducer,
  audioplayer: audioReducer,
  signin: signinReducer,
  theme: themeReducer, 
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a persistor
export const persistor = persistStore(store);
export default store;