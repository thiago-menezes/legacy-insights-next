'use client';

import { useSession } from 'next-auth/react';
import { Button, FormControl, Text, TextField, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';

export const Settings = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View>
      <PageTitle
        icon={<Icon name="settings" size={32} />}
        title="Configurações"
        description="Gerencie suas preferências e informações da conta"
      />

      <View paddingTop={4} gap={6}>
        {/* Account Information Section */}
        <View
          padding={4}
          borderRadius="medium"
          backgroundColor="elevation-base"
          gap={4}
        >
          <Text variant="featured-2" weight="medium">
            Informações da Conta
          </Text>

          <View gap={3}>
            <FormControl>
              <FormControl.Label>Nome de Usuário</FormControl.Label>
              <TextField
                name="username"
                value={session.user.name || ''}
                disabled
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>E-mail</FormControl.Label>
              <TextField
                name="email"
                value={session.user.email || ''}
                disabled
              />
            </FormControl>

            <View paddingTop={2}>
              <Text color="neutral-faded">
                Para alterar suas informações de conta, entre em contato com o
                suporte.
              </Text>
            </View>
          </View>
        </View>

        {/* Password Section */}
        <View
          padding={4}
          borderRadius="medium"
          backgroundColor="elevation-base"
          gap={4}
        >
          <Text variant="featured-2" weight="medium">
            Segurança
          </Text>

          <View gap={3}>
            <FormControl>
              <FormControl.Label>Senha Atual</FormControl.Label>
              <TextField
                name="currentPassword"
                inputAttributes={{ type: 'password' }}
                placeholder="Digite sua senha atual"
                disabled
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Nova Senha</FormControl.Label>
              <TextField
                name="newPassword"
                inputAttributes={{ type: 'password' }}
                placeholder="Digite a nova senha"
                disabled
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Confirmar Nova Senha</FormControl.Label>
              <TextField
                name="confirmPassword"
                inputAttributes={{ type: 'password' }}
                placeholder="Confirme a nova senha"
                disabled
              />
            </FormControl>

            <View paddingTop={2}>
              <Button disabled>Alterar Senha</Button>
              <View paddingTop={2}>
                <Text color="neutral-faded">
                  Funcionalidade de alteração de senha em breve.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View
          padding={4}
          borderRadius="medium"
          backgroundColor="elevation-base"
          gap={4}
        >
          <Text variant="featured-2" weight="medium">
            Preferências
          </Text>

          <View gap={3}>
            <View direction="row" justify="space-between" align="center">
              <View>
                <Text weight="medium">Notificações por E-mail</Text>
                <Text color="neutral-faded">
                  Receba atualizações sobre suas campanhas e integrações
                </Text>
              </View>
              <Button disabled>Em Breve</Button>
            </View>

            <View direction="row" justify="space-between" align="center">
              <View>
                <Text weight="medium">Modo Escuro</Text>
                <Text color="neutral-faded">
                  Ativar tema escuro na interface
                </Text>
              </View>
              <Button disabled>Em Breve</Button>
            </View>

            <View direction="row" justify="space-between" align="center">
              <View>
                <Text weight="medium">Idioma</Text>
                <Text color="neutral-faded">Português (Brasil)</Text>
              </View>
              <Button disabled>Em Breve</Button>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
