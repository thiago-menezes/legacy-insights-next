import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { View, Text, Button, useTheme } from 'reshaped';
import { Icon } from '@/components/icon';
import { NAV_ITEMS } from './constants';
import styles from './styles.module.scss';
import { SidebarProps } from './types';

export const Sidebar = ({ isVisible, onToggle, isMobile }: SidebarProps) => {
  const pathname = usePathname();
  const { colorMode } = useTheme();

  if (!isVisible) return;

  return (
    <View
      as="aside"
      direction="column"
      padding={4}
      gap={6}
      className={clsx(styles.sidebar, isMobile ? styles.sidebarMobile : '')}
    >
      <View gap={2} direction="row">
        <View className={styles.logoContainer}>
          <Image
            src={`/logo-${colorMode}.svg`}
            alt="Legacy Insight"
            width={240}
            height={40}
            className={styles.logo}
          />
        </View>

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
        {NAV_ITEMS.map((item) => {
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
};
