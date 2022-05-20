import type { Auth0Client } from '@auth0/auth0-spa-js';

const checkResponseBody = <T>(res: Response) => {
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return res.json() as Promise<T>;
  } else {
    return Promise.resolve({});
  }
};

class ApiService {
  private readonly apiUrl: string;
  private readonly client: Auth0Client;

  constructor(apiUrl: string, client: Auth0Client) {
    this.apiUrl = apiUrl;
    this.client = client;
  }

  async get<T>(url: string) {
    const token = await this.client.getTokenSilently();

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return fetch(`${this.apiUrl}${url}`, {
      headers,
    }).then((res) => checkResponseBody<T>(res));
  }

  async post<Res, Req extends {}>(url: string, body?: Req) {
    const token = await this.client.getTokenSilently();

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    return fetch(`${this.apiUrl}${url}`, {
      headers,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }).then((res) => checkResponseBody<Res>(res));
  }

  async patch<Res, Req extends {}>(url: string, body?: Req) {
    const token = await this.client.getTokenSilently();

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    return fetch(`${this.apiUrl}${url}`, {
      headers,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }).then((res) => checkResponseBody<Res>(res));
  }

  async put<Res, Req extends {}>(url: string, body?: Req) {
    const token = await this.client.getTokenSilently();

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    return fetch(`${this.apiUrl}${url}`, {
      headers,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }).then((res) => checkResponseBody<Res>(res));
  }

  async delete<T>(url: string) {
    const token = await this.client.getTokenSilently();

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return fetch(`${this.apiUrl}${url}`, {
      headers,
      method: 'DELETE',
    }).then((res) => checkResponseBody<T>(res));
  }
}

export default ApiService;
