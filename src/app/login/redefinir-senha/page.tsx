'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Text, TextField, View } from 'reshaped';
import { useResetPasswordForm } from '@/features/auth/hooks';
import styles from '@/features/auth/styles.module.scss';

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';

  const { form, isLoading, error, success, onSubmit, goToLogin } =
    useResetPasswordForm(code);

  if (success) {
    return (
      <>
        <View paddingBottom={6}>
          <Text variant="featured-2" weight="bold">
            Senha redefinida!
          </Text>
        </View>

        <View
          padding={4}
          backgroundColor="positive-faded"
          borderRadius="medium"
        >
          <Text variant="body-2" color="positive">
            Sua senha foi alterada com sucesso. Você já pode fazer login com sua
            nova senha.
          </Text>
        </View>

        <View paddingTop={4}>
          <Button color="primary" fullWidth onClick={goToLogin}>
            Ir para o login
          </Button>
        </View>
      </>
    );
  }

  if (!code) {
    return (
      <>
        <View paddingBottom={6}>
          <Text variant="featured-2" weight="bold">
            Link inválido
          </Text>
        </View>

        <View
          padding={4}
          backgroundColor="critical-faded"
          borderRadius="medium"
        >
          <Text variant="body-2" color="critical">
            O link de redefinição de senha é inválido ou expirou. Solicite um
            novo link.
          </Text>
        </View>

        <View paddingTop={4}>
          <Link href="/login/esqueci-senha" style={{ width: '100%' }}>
            <Button color="primary" fullWidth>
              Solicitar novo link
            </Button>
          </Link>
        </View>
      </>
    );
  }

  return (
    <>
      <View paddingBottom={6}>
        <Text variant="featured-2" weight="bold">
          Redefinir senha
        </Text>
        <Text variant="body-3" color="neutral-faded">
          Digite sua nova senha abaixo
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
            name="password"
            placeholder="Nova senha"
            size="large"
            value={form.watch('password')}
            onChange={(e) => form.setValue('password', e.value)}
            inputAttributes={{
              type: 'password',
              autoComplete: 'new-password',
            }}
          />
        </div>

        <div className={styles.inputGroup}>
          <TextField
            name="passwordConfirmation"
            placeholder="Confirme sua nova senha"
            size="large"
            value={form.watch('passwordConfirmation')}
            onChange={(e) => form.setValue('passwordConfirmation', e.value)}
            inputAttributes={{
              type: 'password',
              autoComplete: 'new-password',
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
            Redefinir senha
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

export default ResetPasswordPage;
