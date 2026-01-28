import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ProjectCreateInput } from '@/libs/api/services/projects';
import { ProjectFormProps } from '../types';

export const useProjectForm = ({
  initialValues,
  workspaceId,
}: Pick<ProjectFormProps, 'initialValues' | 'workspaceId'>) => {
  const { register, handleSubmit, setValue, watch } =
    useForm<ProjectCreateInput>({
      defaultValues: {
        name: initialValues?.name || '',
        slug: initialValues?.slug || '',
        description: initialValues?.description || '',
        workspace: workspaceId,
      },
    });

  const values = useMemo(() => watch(), [watch]);

  const handleNameChange = (value: string) => {
    setValue('name', value);
    if (!initialValues?.slug) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    handleNameChange,
    nameValue: values.name,
  };
};
