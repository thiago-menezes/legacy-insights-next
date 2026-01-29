import { RoleGuard } from '@/components/role-guard';
import { Workspaces } from '@/features/workspaces';

const WorkspacesPage = () => {
  return (
    <RoleGuard requireManagement>
      <Workspaces />
    </RoleGuard>
  );
};

export default WorkspacesPage;
