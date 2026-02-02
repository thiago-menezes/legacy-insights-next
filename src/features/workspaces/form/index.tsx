import Image from 'next/image';
import {
  Actionable,
  Button,
  FormControl,
  Text,
  TextField,
  View,
} from 'reshaped';
import { Icon } from '@/components/icon';
import { FORM_PLACEHOLDERS } from '../constants';
import { sanitizeSlug } from '../utils';
import { useWorkspaceForm } from './hooks';
import { WorkspaceFormSkeleton } from './skeleton';
import { WorkspaceFormProps } from './types';

export const WorkspaceForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  isModalActive,
}: WorkspaceFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    handleTriggerUpload,
    logoPreview,
    fileInputRef,
    handleLogoChange,
    nameValue,
    slugValue,
  } = useWorkspaceForm(initialValues);

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
            placeholder={FORM_PLACEHOLDERS.NAME}
            {...register('name', { required: true })}
            value={nameValue}
            onChange={(e) => setValue('name', e.value)}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>Identificador do Workspace</FormControl.Label>
          <TextField
            placeholder={FORM_PLACEHOLDERS.SLUG}
            {...register('slug', { required: true })}
            value={slugValue}
            onChange={(e) => {
              const sanitized = sanitizeSlug(e.value);
              setValue('slug', sanitized);
            }}
            disabled
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
