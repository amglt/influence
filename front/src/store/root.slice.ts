import { AppUser } from '@Models/root.models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RootState = {
  user: AppUser;
};

const initialState: RootState = {
  user: {
    name: '',
    picture: '',
    nickname: '',
    updated_at: new Date(),
    user_id: '',
    blocked: true,
    created_at: new Date(),
    last_ip: '',
    identities: [],
    last_login: new Date(),
    logins_count: 0,
    permissions: [],
  },
};

export const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AppUser>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = rootSlice.actions;
