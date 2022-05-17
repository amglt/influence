import { writable } from 'svelte/store';
import type { Auth0Client } from '@auth0/auth0-spa-js';
import type ApiService from '../services/api.service';

export type User = {
  name: string;
  nickname?: string;
  picture?: string;
  updated_at?: Date;
  id: string;
  sub: string;
  permissions: string[];
};

export const client = writable<Auth0Client>();
export const isAuthenticated = writable(false);
export const user = writable<User>();
export const popupOpen = writable(false);
export const error = writable();

export const apiService = writable<ApiService>();
