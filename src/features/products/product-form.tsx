import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormControl,
  Modal,
  Select,
  Switch,
  Text,
  TextField,
  View,
} from 'reshaped';
import { z } from 'zod';
import { StrapiProduct } from '@/libs/api/services/products';
import { ProductFormData, ProductPlatform } from './types';

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  externalId: z.string().optional(),
  platform: z.enum(['hotmart', 'kiwify', 'kirvano', 'other']),
  price: z.number().positive().optional(),
  currency: z.string().default('BRL'),
  active: z.boolean().default(true),
  projectId: z.string(),
});

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormData) => Promise<void>;
  initialData?: StrapiProduct | null;
}

const PLATFORM_OPTIONS = [
  { value: 'hotmart', label: 'Hotmart' },
  { value: 'kiwify', label: 'Kiwify' },
  { value: 'kirvano', label: 'Kirvano' },
  { value: 'other', label: 'Outro' },
];

export const ProductForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ProductFormProps) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      externalId: '',
      platform: 'hotmart',
      price: undefined,
      currency: 'BRL',
      active: true,
      projectId: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        externalId: initialData.externalId || '',
        platform: initialData.platform || 'hotmart',
        price: initialData.price || undefined,
        currency: initialData.currency || 'BRL',
        active: initialData.active ?? true,
        projectId: initialData.project?.documentId || '',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (values: ProductFormData) => {
    await onSubmit(values);
    reset();
  };

  return (
    <Modal active={isOpen} onClose={onClose} position="center" size="medium">
      <View padding={6} gap={4}>
        <Text variant="featured-2" weight="medium">
          {initialData ? 'Editar Produto' : 'Novo Produto'}
        </Text>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <View gap={4}>
            <FormControl hasError={!!errors.name}>
              <FormControl.Label>Nome do Produto</FormControl.Label>
              <TextField
                name="name"
                value={watch('name')}
                onChange={(args) => setValue('name', args.value)}
                placeholder="Ex: Curso de Marketing Digital"
              />
              {errors.name && (
                <FormControl.Error>{errors.name.message}</FormControl.Error>
              )}
            </FormControl>

            <FormControl hasError={!!errors.platform}>
              <FormControl.Label>Plataforma</FormControl.Label>
              <Select
                name="platform"
                value={watch('platform')}
                onChange={(args) =>
                  setValue('platform', args.value as ProductPlatform)
                }
                options={PLATFORM_OPTIONS}
              />
              {errors.platform && (
                <FormControl.Error>{errors.platform.message}</FormControl.Error>
              )}
            </FormControl>

            <FormControl>
              <FormControl.Label>ID Externo (opcional)</FormControl.Label>
              <TextField
                name="externalId"
                value={watch('externalId') || ''}
                onChange={(args) => setValue('externalId', args.value)}
                placeholder="ID do produto na plataforma"
              />
            </FormControl>

            <View direction="row" gap={4}>
              <FormControl hasError={!!errors.price}>
                <FormControl.Label>Preço (opcional)</FormControl.Label>
                <TextField
                  name="price"
                  value={watch('price')?.toString() || ''}
                  onChange={(args) => {
                    const value =
                      args.value === '' ? undefined : parseFloat(args.value);
                    setValue('price', value);
                  }}
                  inputAttributes={{
                    type: 'number',
                    step: '0.01',
                  }}
                  placeholder="0.00"
                />
                {errors.price && (
                  <FormControl.Error>{errors.price.message}</FormControl.Error>
                )}
              </FormControl>

              <FormControl>
                <FormControl.Label>Moeda</FormControl.Label>
                <TextField
                  name="currency"
                  value={watch('currency')}
                  onChange={(args) => setValue('currency', args.value)}
                  placeholder="BRL"
                  inputAttributes={{ maxLength: 3 }}
                />
              </FormControl>
            </View>

            <FormControl>
              <View direction="row" align="center" gap={2}>
                <Switch
                  name="active"
                  checked={watch('active')}
                  onChange={(args) => setValue('active', args.checked)}
                />
                <Text>Produto ativo</Text>
              </View>
            </FormControl>

            <View direction="row" gap={2} justify="end">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Salvando...'
                  : initialData
                    ? 'Atualizar'
                    : 'Criar Produto'}
              </Button>
            </View>
          </View>
        </form>
      </View>
    </Modal>
  );
};
