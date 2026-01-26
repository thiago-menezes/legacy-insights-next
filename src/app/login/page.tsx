'use client';

import Link from 'next/link';
import { Button, Text, TextField, View } from 'reshaped';
import { useLoginForm } from '@/features/auth/hooks';
import styles from '@/features/auth/styles.module.scss';

const LoginPage = () => {
  const { form, isLoading, error, onSubmit } = useLoginForm();

  return (
    <>
      <View align="center" paddingBottom={6}>
        <Text variant="featured-2" weight="bold">
          Bem-vindo de volta
        </Text>
        <Text variant="body-3" color="neutral-faded">
          Entre com sua conta para continuar
        </Text>
      </View>

      {error && (
        <View
          padding={3}
          backgroundColor="critical-faded"
          borderRadius="medium"
        >
          <Text variant="body-3" color="critical">
            {error}
          </Text>
        </View>
      )}

      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.inputGroup}>
          <TextField
            name="identifier"
            placeholder="seu@email.com"
            size="large"
            value={form.watch('identifier')}
            onChange={(e) => form.setValue('identifier', e.value)}
            inputAttributes={{
              type: 'email',
              autoComplete: 'email',
            }}
          />
        </div>

        <div className={styles.inputGroup}>
          <TextField
            name="password"
            placeholder="Sua senha"
            size="large"
            value={form.watch('password')}
            onChange={(e) => form.setValue('password', e.value)}
            inputAttributes={{
              type: 'password',
              autoComplete: 'current-password',
            }}
          />
        </div>

        <div className={styles.forgotPassword}>
          <Link
            href="/login/esqueci-senha"
            className={styles.forgotPasswordLink}
          >
            Esqueceu a senha?
          </Link>
        </div>

        <div className={styles.submitButton}>
          <Button
            type="submit"
            color="primary"
            size="large"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            Entrar
          </Button>
        </div>
      </form>

      <div className={styles.footer}>
        <Text className={styles.footerText}>
          Não tem uma conta?{' '}
          <Link href="/login/criar-conta" className={styles.footerLink}>
            Criar conta
          </Link>
        </Text>
      </div>
    </>
  );
};

export default LoginPage;
