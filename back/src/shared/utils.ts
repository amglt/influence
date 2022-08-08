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
