import clsx from 'clsx';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { View, Text, Button, useTheme } from 'reshaped';
import { Icon } from '@/components/icon';
import { useSelectedWorkspace } from '@/features/workspaces/context';
import { useWorkspaces } from '@/features/workspaces/hooks';
import { normalizeUrlPath } from '@/utils/sanitize-slug';
import { NAVIGATION_SECTIONS } from './constants';
import { SidebarItem } from './item';
import styles from './styles.module.scss';
import { SidebarProps } from './types';
import { UserSelector } from './user-selector';
import { WorkspaceSelector } from './workspace-selector';

export const Sidebar = ({ isVisible, onToggle, isMobile }: SidebarProps) => {
  const pathname = usePathname();
  const { colorMode } = useTheme();
  const { selectedProject } = useSelectedWorkspace();
  const { workspaces } = useWorkspaces();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (itemLabel: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemLabel)
        ? prev.filter((label) => label !== itemLabel)
        : [...prev, itemLabel],
    );
  };

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
      </View>

      <View gap={2} direction="row" align="center">
        <View grow>
          <WorkspaceSelector />
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

      <View direction="column" gap={6} grow>
        {NAVIGATION_SECTIONS.map((section) => {
          const items =
            typeof section.items === 'function'
              ? section.items(workspaces)
              : section.items;

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
                const href =
                  typeof item.href === 'string'
                    ? item.href
                    : item.href(selectedProject?.slug ?? '');

                const subItems =
                  typeof item.subItems === 'function'
                    ? item.subItems(workspaces)
                    : item.subItems;

                const isActive =
                  normalizeUrlPath(pathname.split('/')[1]) ===
                  normalizeUrlPath(href.split('/')[1]);

                const isExpanded = expandedItems.includes(item.label);
                const hasActiveSubItem =
                  subItems?.some((subItem) => pathname === subItem.href) ||
                  false;

                if (item.expandable && item.subItems) {
                  return (
                    <View key={href} direction="column" gap={1}>
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
                          {subItems?.map((subItem) => {
                            const isSubItemActive = pathname === subItem.href;
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
                    key={href}
                    href={href}
                    label={item.label}
                    icon={item.icon}
                    isActive={isActive}
                    isMobile={isMobile}
                    onToggle={onToggle}
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
