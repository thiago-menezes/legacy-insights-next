import { RoleGuard } from '@/components/role-guard';
import { Settings } from '@/features/settings';

export default function SettingsPage() {
  return (
    <RoleGuard>
      <Settings />
    </RoleGuard>
  );
}
