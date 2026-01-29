export interface Project {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface ProjectSelectorProps {
  projects: Project[];
  selectedProjects: string[];
  onChange: (selectedProjects: string[]) => void;
  isLoading?: boolean;
}
