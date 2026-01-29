'use client';

import { useRouter } from 'next/navigation';
import { View, Text, Button } from 'reshaped';
import { Icon } from '@/components/icon';
import { useSelectedWorkspace } from '@/features/workspaces/context';
import { useUserRole } from '@/features/workspaces/use-user-role';

export default function AccessDeniedPage() {
  const router = useRouter();
  const { role } = useUserRole();
  const { selectedOrg } = useSelectedWorkspace();

  return (
    <View
      direction="column"
      align="center"
      justify="center"
      gap={6}
      paddingBlock={20}
      paddingInline={4}
    >
      <View
        backgroundColor="neutral-faded"
        borderRadius="large"
        padding={8}
        width="100%"
        maxWidth="32rem"
        direction="column"
        align="center"
        gap={6}
      >
        <View
          backgroundColor="critical-faded"
          borderRadius="large"
          padding={6}
          width="5rem"
          height="5rem"
          align="center"
          justify="center"
        >
          <Icon name="lock" size={40} />
        </View>

        <View direction="column" align="center" gap={3}>
          <Text variant="featured-2" weight="bold" align="center">
            Acesso Negado
          </Text>

          <Text variant="body-2" color="neutral" align="center">
            Você não tem permissão para acessar esta página. Seu nível de acesso
            atual é:{' '}
            <Text as="span" weight="bold">
              {role === 'viewer' ? 'Visualizador' : role}
            </Text>
            {selectedOrg && (
              <Text as="span">
                {' '}
                no workspace <strong>{selectedOrg.name}</strong>
              </Text>
            )}
            .
          </Text>

          <Text variant="body-3" color="neutral-faded" align="center">
            Para acessar páginas de gestão, você precisa ter permissões de
            Membro, Admin ou Owner. Entre em contato com um administrador do
            workspace para solicitar acesso.
          </Text>
        </View>

        <View direction="row" gap={3} width="100%">
          <View grow>
            <Button
              fullWidth
              color="primary"
              icon={<Icon name="home" />}
              onClick={() => router.push('/')}
            >
              Ir para Dashboard
            </Button>
          </View>
          <View grow>
            <Button
              fullWidth
              variant="ghost"
              color="neutral"
              icon={<Icon name="arrow-left" />}
              onClick={() => router.back()}
            >
              Voltar
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
