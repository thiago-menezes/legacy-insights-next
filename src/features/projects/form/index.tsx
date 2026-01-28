import { Button, TextField, View, FormControl, TextArea } from 'reshaped';
import { ProjectFormProps } from '../types';
import { useProjectForm } from './hooks';

export const ProjectForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  workspaceId,
}: ProjectFormProps) => {
  const { register, handleSubmit, setValue, handleNameChange, nameValue } =
    useProjectForm({
      initialValues,
      workspaceId,
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <View gap={4} paddingTop={4}>
        <FormControl>
          <FormControl.Label>Nome do Projeto</FormControl.Label>
          <TextField
            placeholder="Ex: Campanha de Verão 2024"
            {...register('name', { required: true })}
            name="name"
            value={nameValue}
            onChange={(e) => handleNameChange(e.value)}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>Identificador do Projeto (URL)</FormControl.Label>
          <TextField
            placeholder="ex: campanha-verao-2024"
            {...register('slug', { required: true })}
            name="slug"
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
            name="description"
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
