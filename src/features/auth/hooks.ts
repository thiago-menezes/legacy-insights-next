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
import { zodResolver } from '@hookform/resolvers/zod';

export interface LoginFormData {
  identifier: string;
  password: string;
}

const loginSchema = z.object({
  identifier: z.string().email('Por favor, insira um e-mail válido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

const registerSchema = z
  .object({
    username: z.string().min(1, 'Nome de usuário é obrigatório'),
    email: z.string(),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .refine(
        (val) => /[A-Z]/.test(val),
        'A senha deve conter pelo menos uma letra maiúscula',
      )
      .refine(
        (val) => /[0-9]/.test(val),
        'A senha deve conter pelo menos um número',
      )
      .refine(
        (val) => /[a-zA-Z]/.test(val),
        'A senha deve conter pelo menos uma letra',
      ),
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
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .refine(
        (val) => /[A-Z]/.test(val),
        'A senha deve conter pelo menos uma letra maiúscula',
      )
      .refine(
        (val) => /[0-9]/.test(val),
        'A senha deve conter pelo menos um número',
      )
      .refine(
        (val) => /[a-zA-Z]/.test(val),
        'A senha deve conter pelo menos uma letra',
      ),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'As senhas não conferem',
    path: ['passwordConfirmation'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function useLoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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

export function useRegisterForm() {
  const { register: authRegister } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
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
