import { RoleGuard } from '@/components/role-guard';
import { IntegrationDetails } from '@/features/integration-details';

export default function IntegrationDetailsPage() {
  return (
    <RoleGuard requireManagement>
      <IntegrationDetails />
    </RoleGuard>
  );
}
