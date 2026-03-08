export type User = {
  id: number;
  username: string;
  email: string;
  authToken: string;
};

export type RegisterUserPayload = {
  username: string;
  password: string;
  email: string;
};

export type LoginUserPayload = {
  identifier: string;
  password: string;
};

export type AuthorizationResponse = {
  jwt: string;
  user: User;
};
