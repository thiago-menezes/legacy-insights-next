import { Fragment, useEffect } from 'react';
import { View, Text, Button, TextField } from 'reshaped';
import { Icon } from '../../icon';
import { ThemeToggle } from '../../theme-toggle';
import styles from './styles.module.scss';
import { HeaderProps } from './types';

export const Header = ({
  isVisible,
  onToggleSidebar,
  exitFullScreen,
  enterFullScreen,
  isMobile,
  sidebarVisible,
}: HeaderProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('header-search');
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        icon={<Icon name="chevron-down" />}
        onClick={exitFullScreen}
        aria-label="Show header"
        className={styles.headerCollapsed}
      />
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
        <Button
          variant="ghost"
          icon={
            <Icon
              name={
                sidebarVisible
                  ? 'layout-sidebar-right-expand'
                  : 'layout-sidebar-right-collapse'
              }
            />
          }
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          size="medium"
        />

        <div className={styles.separator} />

        <Text variant="body-2" color="neutral">
          Boas vindas, Thales Souza
        </Text>
      </View>

      <View direction="row" align="center" gap={3}>
        {!isMobile && (
          <Fragment>
            <Button
              key="button-to-enter-fs"
              variant="ghost"
              icon={<Icon name="maximize" />}
              onClick={enterFullScreen}
              aria-label="Exit fullscreen"
            />
            <div key="search-wrapper" className={styles.searchWrapper}>
              <TextField
                id="header-search"
                name="search"
                placeholder="Buscar"
                startSlot={<Icon name="search" />}
                endSlot={
                  <View className={styles.shortcutBadge}>
                    <Text variant="caption-1" color="neutral-faded">
                      ⌘ K
                    </Text>
                  </View>
                }
                className={styles.searchField}
              />
            </div>
          </Fragment>
        )}

        <div className={styles.notificationWrapper}>
          <Button
            variant="ghost"
            icon={<Icon name="bell" />}
            aria-label="Notifications"
            size="medium"
          />
          <div className={styles.notificationBadge} />
        </div>

        <ThemeToggle />
      </View>
    </View>
  );
};
