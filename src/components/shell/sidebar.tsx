'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { View, Text, Button } from 'reshaped';
import { Icon, IconProps } from '../icon';
import styles from './style.module.scss';

const navItems: { label: string; href: string; icon: IconProps['name'] }[] = [
  { label: 'Dashboard', href: '/', icon: 'layout-dashboard' },
  { label: 'Campaigns', href: '/campaigns', icon: 'telescope' },
  { label: 'Integrations', href: '/integrations', icon: 'plug' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
];

interface SidebarProps {
  isVisible: boolean;
  width: number;
  onToggle: () => void;
  isMobile: boolean;
}

const Sidebar = ({ isVisible, width, onToggle, isMobile }: SidebarProps) => {
  const pathname = usePathname();

  if (!isVisible) return;

  const sidebarContent = (
    <View
      as="aside"
      direction="column"
      padding={4}
      gap={6}
      className={clsx(styles.sidebar, isMobile ? styles.sidebarMobile : '')}
    >
      <View
        direction="row"
        align="center"
        justify="space-between"
        paddingInline={2}
        paddingBlock={4}
      >
        <Text variant="featured-3" weight="bold" color="primary">
          Legacy Insight
        </Text>
        {isMobile && (
          <Button
            variant="ghost"
            icon={<Icon name="x" />}
            onClick={onToggle}
            aria-label="Close sidebar"
          />
        )}
      </View>

      <View direction="column" gap={1} grow>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: 'none', width: '100%' }}
              onClick={isMobile ? onToggle : undefined}
            >
              <Button
                variant={isActive ? 'faded' : 'ghost'}
                color={isActive ? 'primary' : 'neutral'}
                fullWidth
                as="div"
                icon={<Icon name={item.icon} />}
                className={styles.navButton}
              >
                <Text variant="body-2">{item.label}</Text>
              </Button>
            </Link>
          );
        })}
      </View>

      <View paddingInline={2}>
        {!isMobile && (
          <Button
            variant="ghost"
            icon={<Icon name="chevrons-left" />}
            onClick={onToggle}
            fullWidth
            size="small"
          >
            <Text variant="body-3">Collapse</Text>
          </Button>
        )}
      </View>
    </View>
  );

  if (isMobile) {
    return sidebarContent;
  }

  return (
    <div style={{ '--sidebar-width': `${width}px` } as React.CSSProperties}>
      {sidebarContent}
    </div>
  );
};

export default Sidebar;
