import { Auth0Provider as A0Provider } from '@auth0/auth0-react';
import { Text } from '@Components/Typography';
import { ReactNode } from 'react';
import { useSelector } from '@Store/';
import { useNavigate } from 'react-router-dom';

export interface Auth0ProviderProps {
  children?: ReactNode;
}

export function Auth0Provider(props: Auth0ProviderProps) {
  const domain = process.env.DOMAIN;
  const clientId = process.env.FRONT_CLIENT_ID;
  const audience = process.env.AUDIENCE;

  const navigate = useNavigate();

  return !(domain && clientId && audience) ? (
    <Text>Le domain, clientId ou l'audience est mal configuré</Text>
  ) : (
    <A0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={() => {
        const returnTo = localStorage.getItem('influstack-returnTo');
        if (returnTo) {
          navigate(returnTo);
          localStorage.removeItem('influstack-returnTo');
        }
      }}
      audience={audience}
    >
      {props.children}
    </A0Provider>
  );
}
