import { RoleGuard } from '@/components/role-guard';
import { ProductDetails } from '@/features/products/product-details';

export default function ProductDetailsPage() {
  return (
    <RoleGuard requireManagement>
      <ProductDetails />
    </RoleGuard>
  );
}
