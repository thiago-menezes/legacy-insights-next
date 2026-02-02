import { RoleGuard } from '@/components/role-guard';
import { Products } from '@/features/products';

export default function ProductsPage() {
  return (
    <RoleGuard requireManagement>
      <Products />
    </RoleGuard>
  );
}
