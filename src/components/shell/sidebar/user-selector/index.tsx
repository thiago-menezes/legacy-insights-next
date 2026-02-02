'use client';

import { Avatar, Divider, DropdownMenu, Text, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { useAuth } from '@/features/auth/context';
import styles from './styles.module.scss';
import Link from 'next/link';

export const UserSelector = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.container}>
      <DropdownMenu width="content" triggerType="hover" position="start-top">
        <DropdownMenu.Trigger>
          {(attributes) => (
            <DropdownMenu.Item className={styles.trigger} {...attributes}>
              <View direction="row" align="center" gap={3}>
                <Avatar
                  variant="faded"
                  icon={<Icon name="user" style={{ fontSize: 24 }} />}
                />

                <View direction="column" className={styles.info}>
                  <Text
                    variant="body-3"
                    weight="medium"
                    className={styles.name}
                  >
                    {user.username}
                  </Text>
                  <Text
                    variant="caption-1"
                    color="neutral"
                    className={styles.email}
                  >
                    {user.email}
                  </Text>
                </View>
                <View>
                  <Icon name="dots" size={16} />
                </View>
              </View>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className={styles.dropdownContent}>
          <View direction="column" className={styles.header} gap={3}>
            <View direction="row" align="center" gap={3}>
              <Avatar
                variant="faded"
                icon={<Icon name="user" style={{ fontSize: 24 }} />}
              />
              <View direction="column">
                <Text variant="body-2" weight="medium">
                  {user.username}
                </Text>
                <Text variant="caption-1" color="neutral">
                  {user.email}
                </Text>
              </View>
            </View>
          </View>

          <Divider />

          <DropdownMenu.Section>
            <Link href="/settings" passHref>
              <DropdownMenu.Item
                className={styles.menuItem}
                startSlot={<Icon name="settings" size={20} />}
              >
                Configurações
              </DropdownMenu.Item>
            </Link>
          </DropdownMenu.Section>

          <Divider />

          <DropdownMenu.Section>
            <DropdownMenu.Item
              className={styles.menuItem}
              startSlot={<Icon name="logout" size={20} />}
              onClick={logout}
              color="critical"
            >
              Log out
            </DropdownMenu.Item>
          </DropdownMenu.Section>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};
