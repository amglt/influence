import { Router } from './Router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { notification } from 'antd';
import { Auth0Provider } from '@auth0/auth0-react';
import { Text } from '@Components/Typography';
import { store } from '@Store/';
import { ApiError } from '@Models/root.models';
import { isApiError } from '@Utils';

const globalErrorNotif = (err: ApiError) => {
  notification.open({
    message: err.message,
    description: err.description,
    type: 'error',
    placement: 'bottomRight',
  });
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (err) => {
        if (isApiError(err)) {
          globalErrorNotif(err);
        }
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (err) => {
        if (isApiError(err)) {
          globalErrorNotif(err);
        }
      },
    },
  },
});

export function Providers() {
  const domain = process.env.DOMAIN;
  const clientId = process.env.FRONT_CLIENT_ID;
  const audience = process.env.AUDIENCE;

  return !!(domain && clientId && audience) ? (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Auth0Provider
          domain={domain}
          clientId={clientId}
          redirectUri={window.location.origin}
          audience={audience}
        >
          <Router />
        </Auth0Provider>
      </QueryClientProvider>
    </Provider>
  ) : (
    <Text>Le domain, clientId ou l'audience est mal configuré</Text>
  );
}
