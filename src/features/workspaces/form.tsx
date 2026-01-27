import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  Button,
  TextField,
  View,
  Text,
  Actionable,
  FormControl,
} from 'reshaped';
import { Icon } from '@/components/icon';
import { useAuth } from '@/features/auth/context';
import { getMediaUrl } from '@/libs/api/strapi';
import { WorkspaceFormSkeleton } from './form-skeleton';
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
  /** Whether the form is currently in a loading state */
  isModalActive?: boolean;
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
  isModalActive,
}: WorkspaceFormProps) => {
  const { user } = useAuth();
  const [tempLogoPreview, setTempLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, control } =
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

  // Derived logo preview: uses the temp preview (from file upload) or the initial logo URL
  const logoPreview =
    tempLogoPreview ||
    (initialValues?.logo && typeof initialValues.logo === 'string'
      ? getMediaUrl(initialValues.logo)
      : null);

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

  // No longer needed: useEffect for reset/state sync. Using key prop in parent for remounting.

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('logo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  if (!isModalActive) {
    return <WorkspaceFormSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <View gap={4}>
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
                margin: 'var(--rs-unit-x4) auto 0',
              },
            }}
          >
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt="Logo preview"
                width={100}
                height={100}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
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
        <Text align="center" variant="caption-1" color="neutral-faded">
          Clique para fazer upload do logo
        </Text>

        <FormControl>
          <FormControl.Label>Nome do Workspace</FormControl.Label>
          <TextField
            placeholder="Ex: Minha Empresa"
            {...register('name', { required: true })}
            value={nameValue}
            onChange={(e) => setValue('name', e.value)}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>Slug</FormControl.Label>
          <TextField
            placeholder="ex-minha-empresa"
            {...register('slug', { required: true })}
            value={slugValue}
            onChange={(e) => setValue('slug', e.value)}
          />
        </FormControl>

        <View gap={2} direction="row" justify="end" paddingTop={4}>
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
