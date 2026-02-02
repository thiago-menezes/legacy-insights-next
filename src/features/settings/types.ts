export interface UserSettings {
  id: number;
  username: string;
  email: string;
  blocked?: boolean;
  confirmed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}
