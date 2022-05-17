import { ManagementClient } from 'auth0';

export const getManagementClient = (scope: string) => {
  return new ManagementClient({
    domain: process.env.DOMAIN!,
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    scope,
  });
};
