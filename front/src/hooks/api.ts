import { useAuth0 } from '@auth0/auth0-react';
import axios, { AxiosRequestHeaders } from 'axios';

const reqInstance = axios.create();

const headers: AxiosRequestHeaders = {
  'Content-Type': 'application/json',
};

export function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  const apiUrl = process.env.API_URL;

  async function get<ResType>(endpoint: string) {
    const token = await getAccessTokenSilently();
    const res = await reqInstance.get<ResType>(`${apiUrl}${endpoint}`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  async function post<ResType, ReqType>(endpoint: string, body?: ReqType) {
    const token = await getAccessTokenSilently();
    const res = await reqInstance.post<ResType>(`${apiUrl}${endpoint}`, body, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  async function put<ResType, ReqType>(endpoint: string, body?: ReqType) {
    const token = await getAccessTokenSilently();
    const res = await reqInstance.put<ResType>(`${apiUrl}${endpoint}`, body, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  async function patch<ResType, ReqType>(endpoint: string, body?: ReqType) {
    const token = await getAccessTokenSilently();
    const res = await reqInstance.patch<ResType>(`${apiUrl}${endpoint}`, body, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  async function del<ResType>(endpoint: string) {
    const token = await getAccessTokenSilently();
    const res = await reqInstance.delete<ResType>(`${apiUrl}${endpoint}`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  return { get, post, put, patch, del };
}
