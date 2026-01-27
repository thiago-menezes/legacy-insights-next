import { useForm } from 'react-hook-form';
import { Button, TextField, View, FormControl, TextArea } from 'reshaped';
import { ProjectCreateInput } from '@/libs/api/services/projects';

interface ProjectFormProps {
  initialValues?: Partial<ProjectCreateInput>;
  onSubmit: (values: ProjectCreateInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  workspaceId: string;
}

export const ProjectForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  workspaceId,
}: ProjectFormProps) => {
  const { register, handleSubmit, setValue, watch } =
    useForm<ProjectCreateInput>({
      defaultValues: {
        name: initialValues?.name || '',
        slug: initialValues?.slug || '',
        description: initialValues?.description || '',
        workspace: workspaceId,
      },
    });

  // eslint-disable-next-line react-hooks/incompatible-library -- watch() is needed for controlled input value
  const nameValue = watch('name');

  // Auto-generate slug from name
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <View gap={4} paddingTop={4}>
        <FormControl>
          <FormControl.Label>Nome do Projeto</FormControl.Label>
          <TextField
            placeholder="Ex: Campanha de Verão 2024"
            {...register('name', { required: true })}
            value={nameValue}
            onChange={(e) => handleNameChange(e.value)}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>Identificador do Projeto (URL)</FormControl.Label>
          <TextField
            placeholder="ex: campanha-verao-2024"
            {...register('slug', { required: true })}
            onChange={(e) => {
              const sanitized = e.value
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
              setValue('slug', sanitized);
            }}
            disabled
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>Descrição (opcional)</FormControl.Label>
          <TextArea
            placeholder="Descreva o objetivo deste projeto..."
            {...register('description')}
            onChange={(e) => setValue('description', e.value)}
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
            {initialValues?.name ? 'Salvar Alterações' : 'Criar Projeto'}
          </Button>
        </View>
      </View>
    </form>
  );
};
