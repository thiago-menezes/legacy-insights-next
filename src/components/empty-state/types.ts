import type { IconNames } from '@/components/icon';

export interface EmptyStateProps {
  icon: IconNames;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}
