import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { notification } from 'antd';
import { store } from '@Store/';
import { ApiError } from '@Models/root.models';
import { isApiError } from '@Utils';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

export interface ProvidersProps {
  children?: ReactNode;
}

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

export function Providers(props: ProvidersProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{props.children}</BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}
