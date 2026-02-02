import { useEffect, useState } from 'react';
import { Button, Divider, Text, TextField, View, useToast } from 'reshaped';
import { Icon } from '@/components/icon';

interface HotmartConfigProps {
  webhookUrl: string;
  onUpdateSecret: (secret: string) => Promise<void>;
  initialSecret?: string;
}

export const HotmartConfig = ({
  webhookUrl,
  onUpdateSecret,
  initialSecret,
}: HotmartConfigProps) => {
  const [copied, setCopied] = useState(false);
  const [secret, setSecret] = useState(initialSecret || '');
  const [isSaving, setIsSaving] = useState(false);

  const { show } = useToast();

  useEffect(() => {
    if (initialSecret) {
      setSecret(initialSecret);
    }
  }, [initialSecret]);

  const onSave = async (value: string) => {
    setIsSaving(true);
    try {
      await onUpdateSecret(value);
      show({
        title: 'Sucesso',
        text: 'Webhook Secret atualizado com sucesso!',
        color: 'positive',
      });
    } catch (error) {
      show({
        title: 'Erro',
        text: 'Falha ao atualizar Webhook Secret.',
        color: 'critical',
      });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View gap={4}>
      <Text variant="featured-3" weight="bold">
        Configuração do Webhook Hotmart
      </Text>

      <View gap={3}>
        <Text variant="body-2">
          Para configurar o webhook no Hotmart, siga os passos abaixo:
        </Text>

        <View gap={2} paddingStart={3}>
          <Text variant="body-3">
            1. Acesse o painel do Hotmart e vá em{' '}
            <strong>Ferramentas → Webhook (API e notificações)</strong>
          </Text>
          <Text variant="body-3">
            2. Clique em <strong>+ Cadastrar Webhook</strong>
          </Text>
          <Text variant="body-3">
            3. Dê um nome descritivo para a configuração
          </Text>
          <Text variant="body-3">
            4. Cole a URL do webhook abaixo no campo de URL de entrega
          </Text>
          <Text variant="body-3">
            5. Selecione o produto e os eventos que deseja monitorar
          </Text>
          <Text variant="body-3">
            6. Copie o <strong>hottok</strong> gerado e configure-o nas
            configurações da integração
          </Text>
          <Text variant="body-3">
            7. Clique em <strong>Salvar</strong>
          </Text>
        </View>
      </View>

      <Divider />

      <View gap={2}>
        <Text weight="medium">URL do Webhook</Text>
        <View
          direction="row"
          gap={2}
          align="center"
          padding={3}
          borderRadius="medium"
          backgroundColor="neutral-faded"
        >
          <Text variant="body-3" color="neutral">
            {webhookUrl}
          </Text>
          <Button
            icon={<Icon name={copied ? 'check' : 'clipboard'} size={16} />}
            onClick={handleCopy}
            size="small"
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
        </View>
      </View>

      <View padding={3} borderRadius="medium" backgroundColor="critical-faded">
        <Text variant="body-3" color="critical">
          <strong>Importante:</strong> O Hotmart envia um token chamado{' '}
          <strong>hottok</strong> que deve ser configurado como &quot;Webhook
          abaixo para validar os webhooks.
        </Text>
      </View>

      <View gap={2}>
        <Text weight="medium">Webhook Secret (Hottok)</Text>
        <View direction="row" gap={2}>
          <TextField
            name="webhookSecret"
            placeholder="Cole o hottok aqui"
            onChange={(e) => setSecret(e.value)}
            value={secret}
            inputAttributes={{ type: 'password' }}
          />
          <Button
            variant="outline"
            onClick={() => onSave(secret)}
            loading={isSaving}
            disabled={isSaving}
          >
            Salvar
          </Button>
        </View>
      </View>

      <Divider />

      <View gap={2}>
        <Text weight="medium">Eventos Suportados</Text>
        <View gap={2}>
          <Text variant="body-3">
            • <strong>PURCHASE_APPROVED</strong> - Compra aprovada
          </Text>
          <Text variant="body-3">
            • <strong>PURCHASE_COMPLETE</strong> - Compra completa
          </Text>
          <Text variant="body-3">
            • <strong>PURCHASE_CANCELED</strong> - Compra cancelada
          </Text>
          <Text variant="body-3">
            • <strong>PURCHASE_REFUNDED</strong> - Compra reembolsada
          </Text>
          <Text variant="body-3">
            • <strong>PURCHASE_CHARGEBACK</strong> - Chargeback
          </Text>
          <Text variant="body-3">
            • <strong>PURCHASE_DELAYED</strong> - Compra atrasada
          </Text>
          <Text variant="body-3">
            • <strong>PURCHASE_EXPIRED</strong> - Compra expirada
          </Text>
          <Text variant="body-3">
            • <strong>SUBSCRIPTION_CANCELLATION</strong> - Assinatura cancelada
          </Text>
          <Text variant="body-3">
            • <strong>SUBSCRIPTION_REACTIVATION</strong> - Assinatura reativada
          </Text>
        </View>
      </View>

      <View gap={2}>
        <Text weight="medium">Documentação</Text>
        <a
          href="https://developers.hotmart.com/docs/pt-BR/v1/webhooks/overview/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="small">
            Ver documentação oficial do Hotmart
          </Button>
        </a>
      </View>
    </View>
  );
};
