import clsx from 'clsx';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { View, Text, Button, useTheme } from 'reshaped';
import { Icon } from '@/components/icon';
import { NAVIGATION_SECTIONS } from './constants';
import { SidebarItem } from './item';
import styles from './styles.module.scss';
import { SidebarProps } from './types';

export const Sidebar = ({ isVisible, onToggle, isMobile }: SidebarProps) => {
  const pathname = usePathname();
  const { colorMode } = useTheme();
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
        {NAVIGATION_SECTIONS.map((section) => (
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
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const isExpanded = expandedItems.includes(item.label);
              const hasActiveSubItem =
                item.subItems?.some((subItem) => pathname === subItem.href) ||
                false;

              if (item.expandable && item.subItems) {
                return (
                  <View key={item.href} direction="column" gap={1}>
                    <Button
                      variant={isActive || hasActiveSubItem ? 'faded' : 'ghost'}
                      color={
                        isActive || hasActiveSubItem ? 'primary' : 'neutral'
                      }
                      icon={<Icon name={item.icon} />}
                      endIcon={
                        <Icon
                          className={styles.navButtonIcon}
                          name={isExpanded ? 'chevron-down' : 'chevron-right'}
                        />
                      }
                      className={styles.navButton}
                      onClick={() => toggleExpand(item.label)}
                    >
                      {item.label}
                    </Button>

                    {isExpanded && (
                      <View direction="column" gap={1} paddingStart={8}>
                        {item.subItems.map((subItem) => {
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
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  isActive={isActive}
                  isMobile={isMobile}
                  onToggle={onToggle}
                />
              );
            })}
          </View>
        ))}
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
