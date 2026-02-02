import { useState } from 'react';
import { Button, Text, TextArea, TextField, View } from 'reshaped';
import { Icon } from '@/components/icon';

interface WebhookTesterProps {
  webhookUrl: string;
  source: string;
  secret?: string;
}

export const WebhookTester = ({
  webhookUrl,
  source,
  secret,
}: WebhookTesterProps) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    ok: boolean;
    status: number;
    data: unknown;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Default payloads for each platform
  const getDefaultPayload = (source: string) => {
    switch (source) {
      case 'kiwify':
        return JSON.stringify(
          {
            order_id: 'TEST-123456',
            order_status: 'paid',
            amount: 9700,
            customer_email: 'test@example.com',
            customer_name: 'Test User',
          },
          null,
          2,
        );
      case 'hotmart':
        return JSON.stringify(
          {
            event: 'PURCHASE_APPROVED',
            hottok: 'YOUR_HOTTOK_HERE',
            data: {
              purchase: {
                transaction: 'HP-123456',
                price: { value: 97.0 },
                sck: 'source_test',
              },
              buyer: {
                email: 'test@example.com',
                name: 'Test User',
              },
            },
          },
          null,
          2,
        );
      case 'kirvano':
        return JSON.stringify(
          {
            event: 'PAYMENT_APPROVED',
            sale_id: 'KV-123456',
            total_price: 'R$ 97,00',
            customer: {
              email: 'test@example.com',
              name: 'Test User',
            },
          },
          null,
          2,
        );
      default:
        return JSON.stringify(
          {
            event: 'test_event',
            id: 'test_id_123',
            amount: 100,
          },
          null,
          2,
        );
    }
  };

  const [payload, setPayload] = useState(getDefaultPayload(source));

  const [targetUrl, setTargetUrl] = useState(webhookUrl);

  const handleTest = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add dummy headers that might be expected
          'x-hotmart-hottok':
            source === 'hotmart' ? JSON.parse(payload).hottok : '',
          'x-kiwify-signature':
            source === 'kiwify' ? secret || 'test-signature' : '',
        },
        body: payload,
      });

      const data = await res.json().catch(() => ({ status: res.statusText }));

      setResponse({
        status: res.status,
        ok: res.ok,
        data: data,
      });
    } catch (error) {
      setError(JSON.stringify(error) || 'Failed to send test webhook');
    } finally {
      setLoading(false);
    }
  };

  if (!expanded) {
    return (
      <Button
        variant="outline"
        onClick={() => setExpanded(true)}
        icon={<Icon name="bolt" size={16} />}
      >
        Testar Webhook
      </Button>
    );
  }

  return (
    <View
      gap={4}
      padding={4}
      backgroundColor="neutral-faded"
      borderRadius="medium"
    >
      <View direction="row" justify="space-between" align="center">
        <Text weight="bold">Testar Webhook</Text>
        <Button
          variant="ghost"
          size="small"
          onClick={() => setExpanded(false)}
          icon={<Icon name="x" size={16} />}
        />
      </View>

      <Text variant="body-3">
        Envie um payload de teste para verificar se sua integração está
        recebendo os eventos corretamente. Certifique-se de que o &quot;Webhook
        Secret&quot; está configurado corretamente se estiver testando validação
        de assinatura.
      </Text>

      <View gap={2}>
        <Text weight="medium">URL do Webhook</Text>
        <TextField
          name="targetUrl"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.value)}
        />
      </View>

      <View gap={2}>
        <Text weight="medium">Payload (JSON)</Text>
        <TextArea
          name="payload"
          value={payload}
          onChange={(e) => setPayload(e.value)}
          attributes={{
            style: { fontFamily: 'monospace', minHeight: '200px' },
          }}
        />
      </View>

      <View direction="row" gap={2}>
        <Button
          color="primary"
          onClick={handleTest}
          loading={loading}
          disabled={loading}
        >
          Enviar Teste
        </Button>
        <Button
          variant="outline"
          onClick={() => setPayload(getDefaultPayload(source))}
        >
          Resetar Payload
        </Button>
      </View>

      {error && (
        <View padding={3} backgroundColor="critical-faded" borderRadius="small">
          <Text color="critical" variant="body-3">
            {error}
          </Text>
        </View>
      )}

      {response && (
        <View
          gap={2}
          padding={3}
          backgroundColor={response.ok ? 'positive-faded' : 'critical-faded'}
          borderRadius="small"
        >
          <Text weight="bold" color={response.ok ? 'positive' : 'critical'}>
            Status: {response.status} {response.ok ? 'OK' : 'Error'}
          </Text>
          <View>
            <Text variant="body-3">
              {JSON.stringify(response.data, null, 2)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};
