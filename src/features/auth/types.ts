export interface LoginFormData {
  identifier: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  code: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  confirmed?: boolean;
  blocked?: boolean;
  provider?: string;
}

export interface AuthResponse {
  jwt: string;
  user: AuthUser;
}

export interface SocialProvider {
  id: 'google' | 'facebook';
  label: string;
  icon: string;
}
