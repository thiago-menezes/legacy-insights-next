'use client';

import Link from 'next/link';
import { Button, Text, TextField, View } from 'reshaped';
import { useForgotPasswordForm } from '@/features/auth/hooks';
import styles from '@/features/auth/styles.module.scss';

const ForgotPasswordPage = () => {
  const { form, isLoading, error, success, onSubmit, reset } =
    useForgotPasswordForm();

  if (success) {
    return (
      <>
        <View align="center" paddingBottom={6}>
          <Text variant="featured-2" weight="bold">
            Verifique seu e-mail
          </Text>
        </View>

        <View
          padding={4}
          backgroundColor="positive-faded"
          borderRadius="medium"
        >
          <Text variant="body-2" color="positive">
            Enviamos um link de recuperação para o seu e-mail. Verifique sua
            caixa de entrada e siga as instruções.
          </Text>
        </View>

        <View gap={3} paddingTop={4}>
          <Button variant="outline" fullWidth onClick={reset}>
            Enviar novamente
          </Button>

          <Link href="/login" style={{ width: '100%' }}>
            <Button color="primary" fullWidth>
              Voltar para o login
            </Button>
          </Link>
        </View>
      </>
    );
  }

  return (
    <>
      <Link href="/login" className={styles.backLink}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Voltar para o login
      </Link>

      <View align="center" paddingBottom={6}>
        <Text variant="featured-2" weight="bold">
          Esqueceu sua senha?
        </Text>
        <Text variant="body-3" color="neutral-faded">
          Digite seu e-mail e enviaremos um link para redefinir sua senha
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
            name="email"
            placeholder="seu@email.com"
            size="large"
            value={form.watch('email')}
            onChange={(e) => form.setValue('email', e.value)}
            inputAttributes={{
              type: 'email',
              autoComplete: 'email',
            }}
          />
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
            Enviar link de recuperação
          </Button>
        </div>
      </form>

      <div className={styles.footer}>
        <Text className={styles.footerText}>
          Lembrou sua senha?{' '}
          <Link href="/login" className={styles.footerLink}>
            Fazer login
          </Link>
        </Text>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
