import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from '@Store/';
import { setDiscordToken, setToken, setUser } from '@Store/root.slice';

export function Login() {
  const [searchParams] = useSearchParams();
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    if (code && clientId && clientSecret) {
      setIsLoadingUser(true);
      axios
        .post(
          `https://discord.com/api/v10/oauth2/token`,
          new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `${window.location.origin}/login`,
          }),
        )
        .then((res) => {
          const { access_token } = res.data;
          dispatch(setDiscordToken(access_token));
          axios
            .get('https://discord.com/api/v10/oauth2/@me', {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            })
            .then((discordRes) => {
              const { id, username } = discordRes.data.user;
              axios
                .post(`${process.env.API_URL}/login`, { id, username })
                .then((loginRes) => {
                  const { user, accessToken } = loginRes.data;
                  dispatch(setUser(user));
                  dispatch(setToken(accessToken));
                  const returnTo = localStorage.getItem('influstack-returnTo');
                  if (returnTo) navigate(returnTo);
                });
            });
        })
        .catch(() => {})
        .finally(() => {
          setIsLoadingUser(false);
        });
    }
  }, [dispatch, navigate, searchParams]);

  return isLoadingUser ? <div>Connexion en cours</div> : <div />;
}
