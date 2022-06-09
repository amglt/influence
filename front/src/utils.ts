import { ApiError } from '@Models/root.models';

export function isApiError(err: ApiError | unknown): err is ApiError {
  return (err as ApiError).message !== undefined;
}
