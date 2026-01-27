import Image from 'next/image';
import Link from 'next/link';
import { View, Text, DropdownMenu } from 'reshaped';
import { Icon } from '@/components/icon';
import { useWorkspaces } from '@/features/workspaces/hooks';
import { getMediaUrl } from '@/libs/api/strapi';
import { DEFAULT_ORG_ICON } from './constants';
import { useWorkspaceSelector } from './hooks';
import styles from './styles.module.scss';

export const WorkspaceSelector = () => {
  const {
    selectedOrgId,
    selectedWorkspaceId,
    selectedOrg,
    selectedWorkspace,
    handleSelectWorkspace,
  } = useWorkspaceSelector();
  const { workspaces } = useWorkspaces();

  const currentOrgLogo = selectedOrg?.logo?.url
    ? getMediaUrl(selectedOrg.logo.url)
    : null;

  return (
    <div className={styles.container}>
      <DropdownMenu width="content" triggerType="hover" position="start-top">
        <DropdownMenu.Trigger>
          {(attributes) => (
            <DropdownMenu.Item className={styles.trigger} {...attributes}>
              <View direction="row" align="center" gap={3}>
                <View className={styles.orgIcon}>
                  {currentOrgLogo ? (
                    <Image
                      src={currentOrgLogo}
                      alt={selectedOrg?.name || 'Logo'}
                      width={24}
                      height={24}
                      className={styles.logoImage}
                      unoptimized
                    />
                  ) : (
                    <Icon name={DEFAULT_ORG_ICON} size={24} />
                  )}
                </View>
                <View direction="column" className={styles.info}>
                  <Text variant="body-2" weight="medium">
                    {selectedOrg?.name || 'Selecione um Workspace'}
                  </Text>
                  <Text variant="caption-1" color="neutral">
                    {selectedWorkspace?.name || 'Selecione um Projeto'}
                  </Text>
                </View>
                <View>
                  <Icon name="chevron-down" size={16} />
                </View>
              </View>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          {workspaces.map((org) => (
            <DropdownMenu.Section key={org.documentId}>
              <DropdownMenu.SubMenu>
                <DropdownMenu.SubTrigger
                  startSlot={
                    org.logo?.url ? (
                      <Image
                        src={getMediaUrl(org.logo.url)!}
                        alt={org.name}
                        width={20}
                        height={20}
                        className={styles.menuLogoImage}
                        unoptimized
                      />
                    ) : (
                      <Icon name={DEFAULT_ORG_ICON} size={20} />
                    )
                  }
                >
                  {org.name}
                </DropdownMenu.SubTrigger>

                <DropdownMenu.Content>
                  {(org.projects || []).map((ws) => {
                    const isSelected =
                      selectedOrgId === org.documentId &&
                      selectedWorkspaceId === String(ws.id);

                    return (
                      <DropdownMenu.Item
                        key={ws.id}
                        onClick={() =>
                          handleSelectWorkspace(org.documentId, String(ws.id))
                        }
                        selected={isSelected}
                        startSlot={<Icon name="folder" size={16} />}
                      >
                        {ws.name}
                      </DropdownMenu.Item>
                    );
                  })}

                  <Link href={`/workspaces/${org.slug || org.documentId}`}>
                    <DropdownMenu.Item
                      startSlot={<Icon name="plus" size={16} />}
                    >
                      Add novo Projeto
                    </DropdownMenu.Item>
                  </Link>
                </DropdownMenu.Content>
              </DropdownMenu.SubMenu>
            </DropdownMenu.Section>
          ))}

          <DropdownMenu.Section>
            <Link href="/workspaces">
              <DropdownMenu.Item startSlot={<Icon name="plus" size={16} />}>
                Add novo Workspace
              </DropdownMenu.Item>
            </Link>
          </DropdownMenu.Section>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};
