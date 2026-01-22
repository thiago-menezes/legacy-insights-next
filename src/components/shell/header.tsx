'use client';

import { View, Text, Button, Avatar, Breadcrumbs } from 'reshaped';
import { Icon } from '../icon';
import { ThemeToggle } from '../theme-toggle';
import styles from './style.module.scss';

interface HeaderProps {
  isVisible: boolean;
  onToggleSidebar: () => void;
  enterFullScreen: () => void;
  exitFullScreen: () => void;
  isMobile: boolean;
}

const Header = ({
  isVisible,
  onToggleSidebar,
  exitFullScreen,
  enterFullScreen,
  isMobile,
}: HeaderProps) => {
  if (!isVisible) {
    return (
      <div className={styles.headerCollapsed}>
        <Button
          variant="ghost"
          icon={<Icon name="chevron-down" />}
          onClick={exitFullScreen}
          aria-label="Show header"
          size="small"
        />
      </div>
    );
  }

  return (
    <View
      as="header"
      direction="row"
      align="center"
      justify="space-between"
      paddingInline={6}
      paddingBlock={4}
      className={styles.header}
    >
      <View direction="row" align="center" gap={4}>
        {isMobile && (
          <Button
            variant="ghost"
            icon={<Icon name="menu" />}
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          />
        )}
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Dashboard</Breadcrumbs.Item>
        </Breadcrumbs>
      </View>

      <View direction="row" align="center" gap={4}>
        {!isMobile && (
          <Button
            variant="ghost"
            icon={<Icon name="maximize" />}
            onClick={enterFullScreen}
            aria-label="Exit fullscreen"
          />
        )}
        <ThemeToggle />
        <Button
          variant="ghost"
          icon={<Icon name="bell" />}
          aria-label="Notifications"
        />
        <View direction="row" align="center" gap={3}>
          <View align="end">
            <Text variant="body-1" weight="bold">
              Thiago Menezes
            </Text>
            <Text variant="body-3" color="neutral-faded">
              Administrator
            </Text>
          </View>
          <Avatar initials="TM" size={10} />
        </View>
      </View>
    </View>
  );
};

export default Header;
