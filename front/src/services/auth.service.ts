import createAuth0Client, {
  Auth0Client,
  PopupLoginOptions,
} from '@auth0/auth0-spa-js';
import { isAuthenticated, popupOpen, user } from '../store/app';
import { mapUser } from '../shared/utils';

async function createClient() {
  return await createAuth0Client({
    domain: process.env.DOMAIN,
    client_id: process.env.FRONT_CLIENT_ID,
    audience: process.env.AUDIENCE,
  });
}

async function loginWithPopup(
  client: Auth0Client,
  options?: PopupLoginOptions,
) {
  popupOpen.set(true);
  try {
    await client.loginWithPopup(options);

    const auth0User = await client.getUser();
    user.set(mapUser(auth0User));
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
