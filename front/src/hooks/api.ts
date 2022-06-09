import { useAuth0 } from '@auth0/auth0-react';
import axios, { AxiosRequestHeaders } from 'axios';

const reqInstance = axios.create();

const headers: AxiosRequestHeaders = {
  'Content-Type': 'application/json',
};

const handleApiError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return Promise.reject(
      err.response ? err.response.data : { message: err.message },
    );
  } else {
    return Promise.reject({ message: err });
  }
};

export function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  const apiUrl = process.env.API_URL;

  async function get<ResType>(endpoint: string) {
    try {
      const token = await getAccessTokenSilently();
      const res = await reqInstance.get<ResType>(`${apiUrl}${endpoint}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return handleApiError(err);
    }
  }

  async function post<ResType, ReqType>(endpoint: string, body?: ReqType) {
    try {
      const token = await getAccessTokenSilently();
      const res = await reqInstance.post<ResType>(
        `${apiUrl}${endpoint}`,
        body,
        {
          headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      return handleApiError(err);
    }
  }

  async function put<ResType, ReqType>(endpoint: string, body?: ReqType) {
    try {
      const token = await getAccessTokenSilently();
      const res = await reqInstance.put<ResType>(`${apiUrl}${endpoint}`, body, {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return handleApiError(err);
    }
  }

  async function patch<ResType, ReqType>(endpoint: string, body?: ReqType) {
    try {
      const token = await getAccessTokenSilently();
      const res = await reqInstance.patch<ResType>(
        `${apiUrl}${endpoint}`,
        body,
        {
          headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      return handleApiError(err);
    }
  }

  async function del<ResType>(endpoint: string) {
    try {
      const token = await getAccessTokenSilently();
      const res = await reqInstance.delete<ResType>(`${apiUrl}${endpoint}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return handleApiError(err);
    }
  }

  return { get, post, put, patch, del };
}
