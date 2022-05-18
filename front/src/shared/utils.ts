import type { User } from '@auth0/auth0-spa-js';
import type { Auth0User } from '../store/app';

export const mapUser = (auth0User: User) => {
  const user: Auth0User = {
    id: auth0User.sub.split('|').pop(),
    sub: auth0User.sub,
    name: auth0User.name,
    nickname: auth0User.nickname,
    picture: auth0User.picture,
    updated_at: auth0User.updated_at
      ? new Date(auth0User.updated_at)
      : undefined,
    permissions: [],
  };
  return user;
};
