import createAuth0Client, {
  Auth0Client,
  PopupLoginOptions,
} from '@auth0/auth0-spa-js';
import { isAuthenticated, popupOpen, user } from '../store/app';

async function createClient() {
  return await createAuth0Client({
    domain: process.env.DOMAIN,
    client_id: process.env.CLIENT_ID,
  });
}

async function loginWithPopup(
  client: Auth0Client,
  options?: PopupLoginOptions,
) {
  popupOpen.set(true);
  try {
    await client.loginWithPopup();

    const auth0User = await client.getUser();
    user.set({
      id: auth0User.sub.split('|').pop(),
      name: auth0User.name,
      nickname: auth0User.nickname,
      picture: auth0User.picture,
      updated_at: auth0User.updated_at
        ? new Date(auth0User.updated_at)
        : undefined,
    });
    isAuthenticated.set(true);
  } catch (e) {
    console.error(e);
  } finally {
    popupOpen.set(false);
  }
}

function logout(client: Auth0Client) {
  return client.logout({
    returnTo: window.location.origin,
  });
}

const auth = {
  createClient,
  loginWithPopup,
  logout,
};

export default auth;
