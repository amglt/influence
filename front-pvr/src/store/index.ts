import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';
import { rootSlice } from './root.slice';

export const store = configureStore({
  reducer: {
    root: rootSlice.reducer,
  },
  devTools: process.env.NODE_ENV === 'development',
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;

export const useDispatch = () => useReduxDispatch<RootDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
