import { Checkbox, FormControl, Skeleton, View } from 'reshaped';
import styles from './styles.module.scss';
import { ProjectSelectorProps } from './types';

export const ProjectSelector = ({
  projects,
  selectedProjects,
  onChange,
  isLoading = false,
}: ProjectSelectorProps) => {
  const handleToggleProject = (projectId: string) => {
    if (selectedProjects.includes(projectId)) {
      onChange(selectedProjects.filter((id) => id !== projectId));
    } else {
      onChange([...selectedProjects, projectId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      onChange([]);
    } else {
      onChange(projects.map((p) => p.documentId));
    }
  };

  if (isLoading) {
    return (
      <View gap={2}>
        <Skeleton height="24px" width="100%" />
        <Skeleton height="24px" width="100%" />
        <Skeleton height="24px" width="100%" />
      </View>
    );
  }

  if (projects.length === 0) {
    return (
      <View className={styles.empty}>
        Nenhum projeto disponível neste workspace
      </View>
    );
  }

  return (
    <FormControl>
      <FormControl.Label>Projetos</FormControl.Label>
      <View gap={2} className={styles.container}>
        <View className={styles.selectAll}>
          <Checkbox
            name="select-all"
            checked={
              selectedProjects.length === projects.length && projects.length > 0
            }
            onChange={handleSelectAll}
          >
            Selecionar todos
          </Checkbox>
        </View>

        {projects.map((project) => (
          <View key={project.documentId} className={styles.projectItem}>
            <Checkbox
              name={`project-${project.documentId}`}
              checked={selectedProjects.includes(project.documentId)}
              onChange={() => handleToggleProject(project.documentId)}
            >
              {project.name}
            </Checkbox>
          </View>
        ))}
      </View>
      <FormControl.Helper>
        {selectedProjects.length === 0
          ? 'Selecione pelo menos um projeto'
          : `${selectedProjects.length} projeto(s) selecionado(s)`}
      </FormControl.Helper>
    </FormControl>
  );
};
