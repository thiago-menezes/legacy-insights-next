import { useEffect, useState } from 'react';
import { Button, Divider, Text, TextField, View, useToast } from 'reshaped';
import { Icon } from '@/components/icon';

interface KiwifyConfigProps {
  webhookUrl: string;
  onUpdateSecret: (secret: string) => Promise<void>;
  initialSecret?: string;
}

export const KiwifyConfig = ({
  webhookUrl,
  onUpdateSecret,

  initialSecret,
}: KiwifyConfigProps) => {
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
        Configuração do Webhook Kiwify
      </Text>

      <View gap={3}>
        <Text variant="body-2">
          Para configurar o webhook no Kiwify, siga os passos abaixo:
        </Text>

        <View gap={2} paddingStart={3}>
          <Text variant="body-3">
            1. Acesse o painel do Kiwify e vá em{' '}
            <strong>Apps → Webhooks</strong>
          </Text>
          <Text variant="body-3">
            2. Clique em <strong>Criar Webhook</strong>
          </Text>
          <Text variant="body-3">
            3. Cole a URL do webhook abaixo no campo de URL
          </Text>
          <Text variant="body-3">
            4. Selecione o produto e os eventos que deseja monitorar
          </Text>
          <Text variant="body-3">
            5. Clique em <strong>Criar</strong>
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

      <View padding={3} borderRadius="medium" backgroundColor="primary-faded">
        <Text variant="body-3" color="primary">
          <strong>💡 Dica:</strong> Use o{' '}
          <a
            href="https://requestbin.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            RequestBin
          </a>{' '}
          para testar seus webhooks antes de configurar no Kiwify.
        </Text>
      </View>

      <View gap={2}>
        <Text weight="medium">Webhook Secret (Token)</Text>
        <View direction="row" gap={2}>
          <TextField
            name="webhookSecret"
            placeholder="Cole o token aqui"
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
        <Text variant="caption-1" color="neutral-faded">
          A autenticação por token é opcional no Kiwify, mas recomendada.
        </Text>
      </View>

      <Divider />

      <View gap={2}>
        <Text weight="medium">Eventos Suportados</Text>
        <View gap={2}>
          <Text variant="body-3">
            • <strong>PAID</strong> - Pagamento aprovado
          </Text>
          <Text variant="body-3">
            • <strong>REFUNDED</strong> - Reembolso processado
          </Text>
          <Text variant="body-3">
            • <strong>CHARGEBACK</strong> - Chargeback recebido
          </Text>
          <Text variant="body-3">
            • <strong>WAITING_PAYMENT</strong> - Aguardando pagamento
          </Text>
          <Text variant="body-3">
            • <strong>REFUSED</strong> - Pagamento recusado
          </Text>
          <Text variant="body-3">
            • <strong>CANCELED</strong> - Pedido cancelado
          </Text>
        </View>
      </View>

      <View gap={2}>
        <Text weight="medium">Documentação</Text>
        <a
          href="https://ajuda.kiwify.com.br/pt-br/article/como-funcionam-os-webhooks-2ydtgl/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="small">
            Ver documentação oficial do Kiwify
          </Button>
        </a>
      </View>
    </View>
  );
};
