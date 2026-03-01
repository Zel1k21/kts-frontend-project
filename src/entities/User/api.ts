import { api } from 'shared/utils/api';

import type { RegisterUserPayload, AuthorizationResponse, LoginUserPayload } from './types';

export const registerUser = async (user: RegisterUserPayload): Promise<AuthorizationResponse> => {
  const response = await api.post<RegisterUserPayload, AuthorizationResponse>(
    '/auth/local/register',
    user
  );
  if (response.jwt) {
    localStorage.setItem('authToken', response.jwt);
  }
  return response;
};

export const loginUser = async (identifier: LoginUserPayload): Promise<AuthorizationResponse> => {
  const response = (await api.post<AuthorizationResponse>('/auth/local', identifier)).data;
  if (response.jwt) {
    localStorage.setItem('authToken', response.jwt);
  }
  return response;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('authToken');
};
