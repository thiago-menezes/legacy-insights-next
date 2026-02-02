'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  getStrapiErrorMessage,
  strapiForgotPassword,
  strapiResetPassword,
} from '@/libs/api/strapi';
import { useAuth } from './context';

// Types
export interface LoginFormData {
  identifier: string;
  password: string;
}

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Nome de usuário deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    passwordConfirmation: z.string(),
    terms: z.boolean().refine((val) => val, 'Você deve aceitar os termos'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'As senhas não conferem',
    path: ['passwordConfirmation'],
  });

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'As senhas não conferem',
    path: ['passwordConfirmation'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Login hook
export function useLoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    const result = await login(data.identifier, data.password);

    if (result.error) {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return {
    form,
    isLoading,
    error,
    registerSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

// Register hook
export function useRegisterForm() {
  const { register: authRegister } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    const result = await authRegister(data.username, data.email, data.password);

    if (result.error) {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return {
    form,
    isLoading,
    error,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

// Forgot password hook
export function useForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await strapiForgotPassword(data.email);
      setSuccess(true);
    } catch (err) {
      setError(getStrapiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    form.reset();
  };

  return {
    form,
    isLoading,
    error,
    success,
    onSubmit: form.handleSubmit(onSubmit),
    reset,
  };
}

// Reset password hook
export function useResetPasswordForm(code: string) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    defaultValues: { password: '', passwordConfirmation: '' },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await strapiResetPassword(code, data.password, data.passwordConfirmation);
      setSuccess(true);
    } catch (err) {
      setError(getStrapiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    router.push('/login');
  };

  return {
    form,
    isLoading,
    error,
    success,
    onSubmit: form.handleSubmit(onSubmit),
    goToLogin,
  };
}
