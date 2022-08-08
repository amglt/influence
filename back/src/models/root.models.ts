export type DecodedToken = {
  nickname: string;
  id: string;
  username: string;
  scope: string;
  iat: number;
  exp: number;
  permissions: string[];
};
