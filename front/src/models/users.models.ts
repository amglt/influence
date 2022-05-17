export type Identity = {
  provider: string;
  access_token: string;
  refresh_token: string;
  user_id: string;
  connection: string;
  isSocial: boolean;
};

export type User = {
  created_at: Date;
  identities: Identity[];
  name: string;
  nickname: string;
  picture: string;
  updated_at: Date;
  user_id: string;
  last_login: Date;
  last_ip: string;
  logins_count: number;
  blocked: boolean;
};
