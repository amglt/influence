import { useAuth0 } from '@auth0/auth0-react';

export function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  const apiUrl = process.env.API_URL;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  async function get<ResType>(endpoint: string) {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) return (await res.json()) as ResType;
    return await res.json();
  }

  async function post<ResType, ReqType>(endpoint: string, body?: ReqType) {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.ok) return (await res.json()) as ResType;
    return await res.json();
  }

  async function put<ResType, ReqType>(endpoint: string, body?: ReqType) {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.ok) return (await res.json()) as ResType;
    return await res.json();
  }

  async function patch<ResType, ReqType>(endpoint: string, body?: ReqType) {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: 'PATCH',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.ok) return (await res.json()) as ResType;
    return await res.json();
  }

  async function del<ResType>(endpoint: string) {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) return (await res.json()) as ResType;
    return await res.json();
  }

  return { get, post, put, patch, del };
}
