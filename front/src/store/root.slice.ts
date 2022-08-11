import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppUser } from '../models/root.models';

export type RootState = {
  user: AppUser;
  token: string;
};

const initialState: RootState = {
  user: {
    username: '',
    picture: '',
    nickname: '',
    guild: '',
    updated_at: new Date(),
    id: 0,
    blocked: true,
    created_at: new Date(),
    permissions: [],
  },
  token: '',
};

export const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AppUser>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    resetRoot: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, setToken, resetRoot } = rootSlice.actions;
