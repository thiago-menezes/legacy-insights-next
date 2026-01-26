import { View, Text, DropdownMenu } from 'reshaped';
import { Icon } from '@/components/icon';
import { ORGANIZATIONS, DEFAULT_ORG_ICON } from './constants';
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

  const currentOrgIcon = selectedOrg?.logoIcon || DEFAULT_ORG_ICON;

  return (
    <div className={styles.container}>
      <DropdownMenu width="content" triggerType="hover" position="start-top">
        <DropdownMenu.Trigger>
          {(attributes) => (
            <DropdownMenu.Item className={styles.trigger} {...attributes}>
              <View direction="row" align="center" gap={3}>
                <View className={styles.orgIcon}>
                  <Icon name={currentOrgIcon} size={24} />
                </View>
                <View direction="column" className={styles.info}>
                  <Text variant="body-2" weight="medium">
                    {selectedOrg?.name}
                  </Text>
                  <Text variant="caption-1" color="neutral">
                    {selectedWorkspace?.name}
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
          {ORGANIZATIONS.map((org) => (
            <DropdownMenu.Section key={org.id}>
              <DropdownMenu.SubMenu>
                <DropdownMenu.SubTrigger
                  startSlot={<Icon name={org.logoIcon} size={20} />}
                >
                  {org.name}
                </DropdownMenu.SubTrigger>

                <DropdownMenu.Content>
                  {org.workspaces.map((ws) => {
                    const isSelected =
                      selectedOrgId === org.id && selectedWorkspaceId === ws.id;
                    return (
                      <DropdownMenu.Item
                        key={ws.id}
                        onClick={() => handleSelectWorkspace(org.id, ws.id)}
                        selected={isSelected}
                      >
                        {ws.name}
                      </DropdownMenu.Item>
                    );
                  })}

                  <DropdownMenu.Item
                    startSlot={<Icon name="plus" size={16} />}
                    onClick={() => {
                      // TODO: Implement functionality
                    }}
                  >
                    Add novo Projeto
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.SubMenu>
            </DropdownMenu.Section>
          ))}

          <DropdownMenu.Section>
            <DropdownMenu.Item
              startSlot={<Icon name="plus" size={16} />}
              onClick={() => {
                // TODO: Implement functionality
              }}
            >
              Add novo Workspace
            </DropdownMenu.Item>
          </DropdownMenu.Section>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};
