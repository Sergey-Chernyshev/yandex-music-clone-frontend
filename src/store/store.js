// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userSettings from '../features/userSettings/userSettings';

export const store = configureStore({
  reducer: {
    userSettings: userSettings,
  },
});

export default store;
