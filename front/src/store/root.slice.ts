import { AppUser } from '@Models/root.models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RootState = {
  user: AppUser;
  token: string;
};

const initialState: RootState = {
  user: {
    username: '',
    picture: '',
    nickname: '',
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
  },
});

export const { setUser, setToken } = rootSlice.actions;
