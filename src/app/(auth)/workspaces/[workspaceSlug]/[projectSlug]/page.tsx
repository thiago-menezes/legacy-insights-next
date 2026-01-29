import { RoleGuard } from '@/components/role-guard';
import { Integrations } from '@/features/integrations';
import { ProjectMembers } from '@/features/users';

const ProjectsPage = () => (
  <RoleGuard requireManagement>
    <Integrations />
    <ProjectMembers />
  </RoleGuard>
);

export default ProjectsPage;
