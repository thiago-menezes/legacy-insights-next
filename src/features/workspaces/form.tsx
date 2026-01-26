import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Button, TextField, View, Text, Actionable } from 'reshaped';
import { Icon } from '@/components/icon';
import { useAuth } from '@/features/auth/context';
import { WorkspaceFormValues } from './types';

/**
 * Interface for WorkspaceForm props.
 * Following AGENTS.md guidelines, always use interface for object definitions.
 */
interface WorkspaceFormProps {
  /** Initial values for the form, used when editing a workspace */
  initialValues?: Partial<WorkspaceFormValues>;
  /** Callback function when the form is submitted */
  onSubmit: (values: WorkspaceFormValues) => void;
  /** Callback function when the form is cancelled */
  onCancel: () => void;
  /** Whether the form is currently in a loading state */
  isLoading?: boolean;
}

/**
 * WorkspaceForm Component
 *
 * A form for creating or editing a workspace. Includes auto-generation of slug from the workspace name.
 *
 * @param {WorkspaceFormProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
export const WorkspaceForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
}: WorkspaceFormProps) => {
  const { user } = useAuth();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, reset, control } =
    useForm<WorkspaceFormValues>({
      defaultValues: (initialValues as WorkspaceFormValues) || {
        name: '',
        slug: '',
        logo: null,
        owner: user?.id,
        members: [],
        integrations: [],
      },
    });

  const nameValue = useWatch({
    control,
    name: 'name',
  });

  const slugValue = useWatch({
    control,
    name: 'slug',
  });

  // Auto-generate slug from name if creating
  useEffect(() => {
    if (!initialValues?.slug && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      setValue('slug', slug);
    }
  }, [nameValue, setValue, initialValues]);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues as WorkspaceFormValues);
    }
  }, [initialValues, reset]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('logo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <View gap={4}>
        <View align="center" gap={2}>
          <Actionable onClick={handleTriggerUpload}>
            <View
              width={20}
              height={20}
              backgroundColor="neutral-faded"
              borderRadius="medium"
              align="center"
              justify="center"
              overflow="hidden"
              attributes={{
                style: {
                  border: '2px dashed var(--rs-color-neutral-faded)',
                  cursor: 'pointer',
                },
              }}
            >
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  width={80}
                  height={80}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  unoptimized
                />
              ) : (
                <View align="center" gap={1}>
                  <Icon name="upload" size={24} />
                  <Text variant="caption-1" color="neutral-faded">
                    Logo
                  </Text>
                </View>
              )}
            </View>
          </Actionable>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLogoChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <Text variant="caption-1" color="neutral-faded">
            Clique para fazer upload do logo
          </Text>
        </View>
        <View direction="row" gap={4}>
          <View gap={1} grow>
            <Text variant="body-3" weight="medium">
              Nome do Workspace
            </Text>
            <TextField
              placeholder="Ex: Minha Empresa"
              {...register('name', { required: true })}
              value={nameValue}
              onChange={(e) => setValue('name', e.value)}
            />
          </View>

          <View gap={1} grow>
            <Text variant="body-3" weight="medium">
              Slug
            </Text>
            <TextField
              placeholder="ex-minha-empresa"
              {...register('slug', { required: true })}
              value={slugValue}
              onChange={(e) => setValue('slug', e.value)}
            />
          </View>
        </View>

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
            {initialValues?.name ? 'Salvar Alterações' : 'Criar Workspace'}
          </Button>
        </View>
      </View>
    </form>
  );
};
