import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from '@Store/';
import { setToken, setUser } from '@Store/root.slice';

export function Login() {
  const [searchParams] = useSearchParams();
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const clientId = process.env.DISCORD_CLIENT_ID;
    if (code && clientId) {
      setIsLoadingUser(true);
      axios
        .post(`${process.env.API_URL}/login`, { code })
        .then((loginRes) => {
          const { user, accessToken } = loginRes.data;
          dispatch(setUser(user));
          dispatch(setToken(accessToken));
          const returnTo = localStorage.getItem('influstack-returnTo');
          if (returnTo) navigate(returnTo);
        })
        .catch(() => {})
        .finally(() => {
          setIsLoadingUser(false);
        });
    }
  }, [dispatch, navigate, searchParams]);

  return isLoadingUser ? <div>Connexion en cours</div> : <div />;
}
