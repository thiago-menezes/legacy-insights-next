'use client';

import Link from 'next/link';
import { Button, Checkbox, FormControl, Text, TextField, View } from 'reshaped';
import { useRegisterForm } from '@/features/auth/hooks';
import styles from '@/features/auth/styles.module.scss';
import { Icon } from '@/components/icon';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const CreateAccountPage = () => {
  const { form, isLoading, error, onSubmit } = useRegisterForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email');

  const {
    formState: { errors, isSubmitted },
    setValue,
    trigger,
    register,
  } = form;

  useEffect(() => {
    register('name');
    register('email');
    register('password');
    register('passwordConfirmation');
    register('terms');
  }, [register]);

  useEffect(() => {
    if (emailFromUrl) {
      setValue('email', emailFromUrl);
    }
  }, [emailFromUrl, setValue]);

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
          <FormControl hasError={!!errors.name}>
            <TextField
              name="name"
              placeholder="Seu nome completo"
              size="large"
              value={form.watch('name')}
              onChange={({ value }) => {
                setValue('name', value);
                if (isSubmitted) trigger('name');
              }}
              inputAttributes={{
                type: 'text',
                autoComplete: 'name',
              }}
            />
            {errors.name?.message && (
              <FormControl.Error>{errors.name.message}</FormControl.Error>
            )}
          </FormControl>
        </div>

        <div className={styles.inputGroup}>
          <FormControl hasError={!!errors.email}>
            <TextField
              name="email"
              placeholder="seu@email.com"
              size="large"
              value={form.watch('email')}
              onChange={({ value }) => {
                setValue('email', value);
                if (isSubmitted) trigger('email');
              }}
              inputAttributes={{
                type: 'email',
                readOnly: !!emailFromUrl,
              }}
            />
            {errors.email?.message && (
              <FormControl.Error>{errors.email.message}</FormControl.Error>
            )}
          </FormControl>
        </div>

        <div className={styles.inputGroup}>
          <FormControl hasError={!!errors.password}>
            <TextField
              name="password"
              placeholder="Crie uma senha"
              size="large"
              value={form.watch('password')}
              onChange={({ value }) => {
                setValue('password', value);
                if (isSubmitted) trigger('password');
              }}
              endSlot={
                <Button
                  variant="ghost"
                  icon={<Icon name={showPassword ? 'eye' : 'eye-off'} />}
                  onClick={() => setShowPassword(!showPassword)}
                />
              }
              inputAttributes={{
                type: showPassword ? 'text' : 'password',
                autoComplete: 'new-password',
              }}
            />

            <View gap={1} paddingTop={2}>
              <View direction="row" align="center" gap={2}>
                <Text
                  variant="caption-1"
                  color={
                    /[A-Z]/.test(form.watch('password') || '')
                      ? 'positive'
                      : 'neutral-faded'
                  }
                >
                  <Icon name="check" />
                </Text>
                <Text
                  variant="caption-1"
                  color={
                    /[A-Z]/.test(form.watch('password') || '')
                      ? 'positive'
                      : 'neutral-faded'
                  }
                >
                  Pelo menos uma letra maiúscula
                </Text>
              </View>
              <View direction="row" align="center" gap={2}>
                <Text
                  variant="caption-1"
                  color={
                    /[a-zA-Z]/.test(form.watch('password') || '')
                      ? 'positive'
                      : 'neutral-faded'
                  }
                >
                  <Icon name="check" />
                </Text>
                <Text
                  variant="caption-1"
                  color={
                    /[a-zA-Z]/.test(form.watch('password') || '')
                      ? 'positive'
                      : 'neutral-faded'
                  }
                >
                  Pelo menos uma letra
                </Text>
              </View>
              <View direction="row" align="center" gap={2}>
                <Text
                  variant="caption-1"
                  color={
                    /[0-9]/.test(form.watch('password') || '')
                      ? 'positive'
                      : 'neutral-faded'
                  }
                >
                  <Icon name="check" />
                </Text>
                <Text
                  variant="caption-1"
                  color={
                    /[0-9]/.test(form.watch('password') || '')
                      ? 'positive'
                      : 'neutral-faded'
                  }
                >
                  Pelo menos um número
                </Text>
              </View>
              <View direction="row" align="center" gap={2}>
                <Text
                  variant="caption-1"
                  color={
                    (form.watch('password') || '').length >= 8
                      ? 'positive'
                      : 'neutral-faded'
                  }
                >
                  <Icon name="check" />
                </Text>
                <Text
                  variant="caption-1"
                  color={
                    (form.watch('password') || '').length >= 8
                      ? 'positive'
                      : 'neutral-faded'
                  }
                >
                  Pelo menos 8 caracteres
                </Text>
              </View>
            </View>

            {errors.password?.message && (
              <FormControl.Error>{errors.password.message}</FormControl.Error>
            )}
          </FormControl>
        </div>

        <div className={styles.inputGroup}>
          <FormControl hasError={!!errors.passwordConfirmation}>
            <TextField
              name="passwordConfirmation"
              placeholder="Confirme sua senha"
              size="large"
              value={form.watch('passwordConfirmation')}
              onChange={({ value }) => {
                setValue('passwordConfirmation', value);
                if (isSubmitted) trigger('passwordConfirmation');
              }}
              endSlot={
                <Button
                  variant="ghost"
                  icon={<Icon name={showConfirmPassword ? 'eye' : 'eye-off'} />}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              inputAttributes={{
                type: showConfirmPassword ? 'text' : 'password',
                autoComplete: 'new-password',
              }}
            />
            {errors.passwordConfirmation?.message && (
              <FormControl.Error>
                {errors.passwordConfirmation.message}
              </FormControl.Error>
            )}
          </FormControl>
        </div>

        <div className={styles.termsCheckbox}>
          <FormControl hasError={!!errors.terms}>
            <Checkbox
              name="terms"
              checked={form.watch('terms')}
              onChange={(e) => {
                form.setValue('terms', e.checked);
                if (isSubmitted) trigger('terms');
              }}
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
            {errors.terms?.message && (
              <FormControl.Error>{errors.terms.message}</FormControl.Error>
            )}
          </FormControl>
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
