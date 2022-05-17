import type { Auth0Client } from '@auth0/auth0-spa-js';

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
    }).then((res) => res.json() as Promise<T>);
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
    }).then((res) => res.json() as Promise<Res>);
  }
}

export default ApiService;
