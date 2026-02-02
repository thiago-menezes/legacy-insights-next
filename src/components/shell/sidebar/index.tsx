import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button, Text, View, useTheme } from 'reshaped';
import { Icon } from '@/components/icon';
import { useSelectedWorkspace } from '@/features/workspaces/context';
import { useUserRole } from '@/features/workspaces/use-user-role';
import { normalizeUrlPath } from '@/utils/sanitize-slug';
import { SidebarItem } from './item';
import styles from './styles.module.scss';
import { SidebarProps } from './types';
import { UserSelector } from './user-selector';
import { buildNavigationSections } from './utils';
import { WorkspaceSelector } from './workspace-selector';

export const Sidebar = ({ isVisible, onToggle, isMobile }: SidebarProps) => {
  const pathname = usePathname();
  const { colorMode } = useTheme();
  const {
    selectedProject,
    selectedOrg,
    hasWorkspaces,
    currentWorkspaceHasProjects,
  } = useSelectedWorkspace();
  const { canManage } = useUserRole();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (itemLabel: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemLabel)
        ? prev.filter((label) => label !== itemLabel)
        : [...prev, itemLabel],
    );
  };

  useEffect(() => {
    if (isMobile) {
      onToggle();
    }
  }, []);

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

      <View gap={2} direction="row" align="center">
        <View grow>
          <WorkspaceSelector />
        </View>
      </View>

      <View direction="column" gap={6} grow>
        {buildNavigationSections(
          selectedOrg?.slug,
          selectedProject?.slug,
          hasWorkspaces,
          currentWorkspaceHasProjects,
          canManage,
        ).map((section) => {
          const items = section.items;

          return (
            <View key={section.title} direction="column" gap={1}>
              {section.title && (
                <View
                  key={`title-${section.title}`}
                  paddingInline={2}
                  paddingBlock={1}
                >
                  <Text variant="caption-1" color="neutral">
                    {section.title}
                  </Text>
                </View>
              )}
              {items.map((item) => {
                const isActive =
                  normalizeUrlPath(pathname) === normalizeUrlPath(item.href);

                const isExpanded = expandedItems.includes(item.label);
                const hasActiveSubItem =
                  item.subItems?.some(
                    (subItem) =>
                      normalizeUrlPath(pathname) ===
                      normalizeUrlPath(subItem.href),
                  ) || false;

                if (item.expandable && item.subItems) {
                  return (
                    <View key={item.href} direction="column" gap={1}>
                      <Button
                        variant="ghost"
                        color={'neutral'}
                        icon={
                          <Icon
                            name={item.icon}
                            className={styles.navButtonIcon}
                          />
                        }
                        endIcon={
                          <Icon
                            className={styles.expandIcon}
                            name={isExpanded ? 'chevron-down' : 'chevron-right'}
                          />
                        }
                        className={clsx(styles.navButton, {
                          [styles.navButtonActive]:
                            isActive || hasActiveSubItem,
                        })}
                        onClick={() => toggleExpand(item.label)}
                      >
                        {item.label}
                      </Button>

                      {isExpanded && (
                        <View direction="column" gap={1} paddingStart={8}>
                          {item.subItems?.map((subItem) => {
                            const isSubItemActive =
                              normalizeUrlPath(pathname) ===
                              normalizeUrlPath(subItem.href);
                            return (
                              <SidebarItem
                                key={subItem.href}
                                href={subItem.href}
                                label={subItem.label}
                                isActive={isSubItemActive}
                                isMobile={isMobile}
                                onToggle={onToggle}
                              />
                            );
                          })}
                        </View>
                      )}
                    </View>
                  );
                }

                return (
                  <SidebarItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    isActive={isActive}
                    isMobile={isMobile}
                    onToggle={onToggle}
                    disabled={item.disabled}
                    disabledTooltip={item.disabledTooltip}
                  />
                );
              })}
            </View>
          );
        })}
      </View>

      <View paddingInline={2}>
        <UserSelector />
      </View>
    </View>
  );
};
