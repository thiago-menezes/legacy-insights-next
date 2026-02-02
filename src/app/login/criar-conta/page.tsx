'use client';

import Link from 'next/link';
import { Button, Checkbox, Text, TextField, View } from 'reshaped';
import { useRegisterForm } from '@/features/auth/hooks';
import styles from '@/features/auth/styles.module.scss';

const CreateAccountPage = () => {
  const { form, isLoading, error, onSubmit } = useRegisterForm();

  return (
    <>
      <View paddingBottom={6}>
        <Text variant="featured-2" weight="bold">
          Criar sua conta
        </Text>
        <Text variant="body-3" color="neutral-faded">
          Comece sua jornada no Legacy Insight
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
            name="username"
            placeholder="Seu nome de usuário"
            size="large"
            value={form.watch('username')}
            onChange={(e) => form.setValue('username', e.value)}
            inputAttributes={{
              type: 'text',
              autoComplete: 'username',
            }}
          />
        </div>

        <div className={styles.inputGroup}>
          <TextField
            name="email"
            placeholder="seu@email.com"
            size="large"
            value={form.watch('email')}
            onChange={(e) => form.setValue('email', e.value)}
            inputAttributes={{
              type: 'email',
            }}
          />
        </div>

        <div className={styles.inputGroup}>
          <TextField
            name="password"
            placeholder="Crie uma senha"
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
            placeholder="Confirme sua senha"
            size="large"
            value={form.watch('passwordConfirmation')}
            onChange={(e) => form.setValue('passwordConfirmation', e.value)}
            inputAttributes={{
              type: 'password',
              autoComplete: 'new-password',
            }}
          />
        </div>

        <div className={styles.termsCheckbox}>
          <Checkbox
            name="terms"
            checked={form.watch('terms')}
            onChange={(e) => form.setValue('terms', e.checked)}
          >
            <Text className={styles.termsText}>
              Eu concordo com os{' '}
              <Link href="/termos" className={styles.termsLink}>
                Termos de Uso
              </Link>{' '}
              e a{' '}
              <Link href="/privacidade" className={styles.termsLink}>
                Política de Privacidade
              </Link>
            </Text>
          </Checkbox>
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
            Criar conta
          </Button>
        </div>
      </form>

      <div className={styles.footer}>
        <Text className={styles.footerText}>
          Já tem uma conta?{' '}
          <Link href="/login" className={styles.footerLink}>
            Fazer login
          </Link>
        </Text>
      </div>
    </>
  );
};

export default CreateAccountPage;
