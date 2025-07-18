import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './slices/contentSlice';

export const store = configureStore({
  reducer: {
    content: contentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
}); 