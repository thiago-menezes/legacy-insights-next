import Link from 'next/link';
import { Button } from 'reshaped';
import { Icon, IconProps } from '@/components/icon';
import styles from './styles.module.scss';

interface SidebarItemProps {
  href: string;
  label: string;
  icon?: IconProps['name'];
  isActive: boolean;
  isMobile: boolean;
  onToggle: () => void;
}

export const SidebarItem = ({
  href,
  label,
  icon,
  isActive,
  isMobile,
  onToggle,
}: SidebarItemProps) => {
  return (
    <Link href={href} onClick={isMobile ? onToggle : undefined}>
      <Button
        variant={isActive ? 'faded' : 'ghost'}
        color={isActive ? 'primary' : 'neutral'}
        fullWidth
        className={styles.navButton}
      >
        <Icon name={icon} />
        {label}
      </Button>
    </Link>
  );
};
