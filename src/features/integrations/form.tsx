import { useForm } from 'react-hook-form';
import { Button, TextField, View, Select, FormControl } from 'reshaped';
import {
  IntegrationCreateInput,
  IntegrationType,
} from '@/libs/api/services/integrations';

interface IntegrationFormProps {
  initialValues?: Partial<IntegrationCreateInput>;
  onSubmit: (values: IntegrationCreateInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  projectId: string | number;
}

const INTEGRATION_TYPES: { label: string; value: IntegrationType }[] = [
  { label: 'Meta Ads', value: 'meta_ads' },
  { label: 'Google Ads', value: 'google_ads' },
];

export const IntegrationForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  projectId,
}: IntegrationFormProps) => {
  const { register, handleSubmit, setValue, watch } =
    useForm<IntegrationCreateInput>({
      defaultValues: {
        name: initialValues?.name || '',
        type: initialValues?.type || 'meta_ads',
        project: projectId,
        status: initialValues?.status || 'disconnected',
      },
    });

  // eslint-disable-next-line react-hooks/incompatible-library
  const typeValue = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <View gap={4} paddingTop={4}>
        <FormControl>
          <FormControl.Label>Nome da Integração</FormControl.Label>
          <TextField
            placeholder="Ex: Minha Conta de Anúncios"
            {...register('name', { required: true })}
            onChange={(e) => setValue('name', e.value)}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>Tipo de Integração</FormControl.Label>
          <Select
            name="type"
            options={INTEGRATION_TYPES}
            value={typeValue}
            onChange={(e) => setValue('type', e.value as IntegrationType)}
          />
        </FormControl>

        <View direction="row" gap={3} justify="end" paddingTop={4}>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            color="primary"
            loading={isLoading}
            disabled={isLoading}
          >
            {initialValues?.name ? 'Salvar Alterações' : 'Conectar'}
          </Button>
        </View>
      </View>
    </form>
  );
};
