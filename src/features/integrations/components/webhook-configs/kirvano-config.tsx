import { useEffect, useState } from 'react';
import { Button, Divider, Text, TextField, View, useToast } from 'reshaped';
import { Icon } from '@/components/icon';

interface KirvanoConfigProps {
  webhookUrl: string;
  onUpdateSecret: (secret: string) => Promise<void>;
  initialSecret?: string;
}

export const KirvanoConfig = ({
  webhookUrl,
  onUpdateSecret,

  initialSecret,
}: KirvanoConfigProps) => {
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
        Configuração do Webhook Kirvano
      </Text>

      <View gap={3}>
        <Text variant="body-2">
          Para configurar o webhook no Kirvano, siga os passos abaixo:
        </Text>

        <View gap={2} paddingStart={3}>
          <Text variant="body-3">
            1. Acesse o painel do Kirvano e vá em{' '}
            <strong>Integrações → Webhooks</strong>
          </Text>
          <Text variant="body-3">
            2. Clique em <strong>Criar Webhook</strong>
          </Text>
          <Text variant="body-3">3. Dê um nome para organização interna</Text>
          <Text variant="body-3">
            4. Cole a URL do webhook abaixo no campo &quot;URL do Webhook&quot;
          </Text>
          <Text variant="body-3">
            5. (Opcional) Configure um token para autenticação
          </Text>
          <Text variant="body-3">
            6. Selecione o produto e os eventos que deseja monitorar
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

      <View padding={3} borderRadius="medium" backgroundColor="primary-faded">
        <Text variant="body-3" color="primary">
          <strong>💡 Dica:</strong> O token de autenticação é opcional no
          Kirvano, mas recomendado para maior segurança. Configure-o como
          &quot;Webhook Secret&quot; abaixo.
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
      </View>

      <Divider />

      <View gap={2}>
        <Text weight="medium">Eventos Suportados</Text>
        <View gap={2}>
          <Text variant="body-3">
            • <strong>BANK_SLIP_GENERATED</strong> - Boleto gerado
          </Text>
          <Text variant="body-3">
            • <strong>BANK_SLIP_PAID</strong> - Boleto pago
          </Text>
          <Text variant="body-3">
            • <strong>BANK_SLIP_EXPIRED</strong> - Boleto expirado
          </Text>
          <Text variant="body-3">
            • <strong>PAYMENT_APPROVED</strong> - Pagamento aprovado
          </Text>
          <Text variant="body-3">
            • <strong>PAYMENT_REFUSED</strong> - Pagamento recusado
          </Text>
          <Text variant="body-3">
            • <strong>PAYMENT_REFUNDED</strong> - Pagamento reembolsado
          </Text>
          <Text variant="body-3">
            • <strong>PAYMENT_CHARGEBACK</strong> - Chargeback
          </Text>
          <Text variant="body-3">
            • <strong>PIX_GENERATED</strong> - PIX gerado
          </Text>
          <Text variant="body-3">
            • <strong>PIX_PAID</strong> - PIX pago
          </Text>
          <Text variant="body-3">
            • <strong>CREDIT_CARD_APPROVED</strong> - Cartão aprovado
          </Text>
        </View>
      </View>

      <View gap={2}>
        <Text weight="medium">Documentação</Text>
        <a
          href="https://help.kirvano.com/hc/central-de-ajuda/articles/1765385505-configurando-integracao-via-webhook"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="small">
            Ver documentação oficial do Kirvano
          </Button>
        </a>
      </View>
    </View>
  );
};
