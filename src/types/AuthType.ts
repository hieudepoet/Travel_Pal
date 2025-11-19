export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export type AuthFormData = LoginFormData | RegisterFormData;

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface AuthError {
  message: string;
  field?: string;
}
