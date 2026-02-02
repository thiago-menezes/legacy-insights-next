import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useAuth } from '@/features/auth/context';
import { getMediaUrl } from '@/libs/api/strapi';
import { workspaceFormSchema } from '../schema';
import { WorkspaceFormValues } from '../types';
import { sanitizeSlug } from '../utils';

export const useWorkspaceForm = (initialValues?: WorkspaceFormValues) => {
  const { user } = useAuth();
  const [tempLogoPreview, setTempLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, control } =
    useForm<WorkspaceFormValues>({
      resolver: zodResolver(workspaceFormSchema),
      defaultValues: (initialValues as WorkspaceFormValues) || {
        name: '',
        slug: '',
        logo: null,
        owner: user?.id,
        members: [],
        integrations: [],
      },
    });

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

  useEffect(() => {
    if (!initialValues?.slug && nameValue) {
      const slug = sanitizeSlug(nameValue);
      setValue('slug', slug);
    }
  }, [nameValue, setValue, initialValues]);

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

  return {
    register,
    handleSubmit,
    setValue,
    control,
    logoPreview,
    nameValue,
    slugValue,
    handleLogoChange,
    handleTriggerUpload,
    fileInputRef,
  };
};
