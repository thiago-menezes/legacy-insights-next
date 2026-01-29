import { RoleGuard } from '@/components/role-guard';
import { WorkspaceDetail } from '@/features/projects';

const WorkspaceDetailPage = () => {
  return (
    <RoleGuard requireManagement>
      <WorkspaceDetail />
    </RoleGuard>
  );
};

export default WorkspaceDetailPage;
