'use client';

import { Button, Checkbox, FormControl, Text, TextField, View } from 'reshaped';
import { PLATFORM_EVENT_TYPES, useWebhookForm } from './hooks';
import styles from './styles.module.scss';
import { WebhookFormProps } from './types';

export const WebhookForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  projectId,
}: WebhookFormProps) => {
  const { form, handleSubmit } = useWebhookForm({
    initialValues,
    onSubmit,
    projectId,
  });

  const location = document.location;

  const { setValue, watch } = form;

  const selectedType = watch('type');
  const nameValue = watch('name');

  const eventTypesValue = watch('eventTypes');
  const signatureValidationValue = watch('signatureValidation');

  const eventTypes = PLATFORM_EVENT_TYPES[selectedType] || [];

  const handleEventTypeToggle = (eventType: string, checked: boolean) => {
    const currentEvents = eventTypesValue || [];
    const newEvents = checked
      ? [...currentEvents, eventType]
      : currentEvents.filter((e) => e !== eventType);
    setValue('eventTypes', newEvents);
  };

  const url = `${location.protocol}//${location.host}/api/webhooks/${selectedType}/[integrationId]`;

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <View gap={4}>
        {/* Name Field */}
        <FormControl>
          <FormControl.Label>Nome da Integração</FormControl.Label>
          <TextField
            name="name"
            placeholder="Ex: Hotmart - Produto Principal"
            value={nameValue || ''}
            onChange={(e) => setValue('name', e.value)}
          />
        </FormControl>

        {/* Event Types */}
        {eventTypes.length > 0 && (
          <FormControl>
            <FormControl.Label>Tipos de Eventos</FormControl.Label>
            <div className={styles.eventTypesList}>
              {eventTypes.map((eventType) => (
                <Checkbox
                  key={eventType}
                  name={`eventType-${eventType}`}
                  checked={eventTypesValue?.includes(eventType) || false}
                  onChange={(e) => handleEventTypeToggle(eventType, e.checked)}
                >
                  {eventType}
                </Checkbox>
              ))}
            </div>
          </FormControl>
        )}

        {/* Signature Validation */}
        <FormControl>
          <Checkbox
            name="signatureValidation"
            checked={signatureValidationValue}
            onChange={(e) => setValue('signatureValidation', e.checked)}
          >
            Validar assinatura das requisições
          </Checkbox>
          <FormControl.Helper>
            Recomendado para maior segurança
          </FormControl.Helper>
        </FormControl>

        {/* Webhook URL Display (read-only) */}
        <FormControl>
          <FormControl.Label>URL do Webhook</FormControl.Label>
          <div className={styles.webhookUrlDisplay}>
            <Text variant="caption-1">
              <View>{url}</View>
            </Text>
          </div>
          <FormControl.Helper>
            Configure esta URL na plataforma {selectedType} após criar a
            integração
          </FormControl.Helper>
        </FormControl>
      </View>

      {/* Form Actions */}
      <View direction="row" gap={3} justify="end" paddingTop={4}>
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" color="primary" loading={isLoading}>
          {initialValues ? 'Atualizar' : 'Criar Integração'}
        </Button>
      </View>
    </form>
  );
};
