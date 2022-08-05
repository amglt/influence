import { ManagementClient } from 'auth0';

export const getManagementClient = (scope: string) => {
  return new ManagementClient({
    domain: process.env.DOMAIN!,
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    scope,
  });
};

export enum RuntimeEnv {
  Influ,
  Alliance,
}

export function getRuntimeEnv() {
  const runtimeEnv = process.env.RUNTIME_ENV;
  switch (runtimeEnv) {
    case 'influ':
      return RuntimeEnv.Influ;
    case 'alliance':
      return RuntimeEnv.Alliance;
    default:
      return RuntimeEnv.Influ;
  }
}
