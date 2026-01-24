import clsx from 'clsx';
import React from 'react';
import { View, Text, Popover, Divider, Button } from 'reshaped';
import { Icon } from '@/components/icon';
import { ORGANIZATIONS, DEFAULT_ORG_ICON } from './constants';
import { useWorkspaceSelector } from './hooks';
import styles from './styles.module.scss';

export const WorkspaceSelector = () => {
  const {
    selectedOrgId,
    selectedWorkspaceId,
    expandedOrgs,
    selectedOrg,
    selectedWorkspace,
    toggleOrg,
    handleSelectWorkspace,
  } = useWorkspaceSelector();

  const currentOrgIcon = selectedOrg?.logoIcon || DEFAULT_ORG_ICON;

  return (
    <div className={styles.container}>
      <Popover
        triggerType="hover"
        width="trigger"
        position="top-end"
        padding={0}
      >
        <Popover.Trigger>
          {(attributes) => (
            <button className={styles.trigger} {...attributes} type="button">
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
            </button>
          )}
        </Popover.Trigger>

        <Popover.Content>
          <div className={styles.dropdown}>
            {ORGANIZATIONS.map((org, index) => {
              const isExpanded = expandedOrgs.includes(org.id);

              return (
                <div key={org.id} className={styles.orgGroup}>
                  {index !== 0 && <Divider />}
                  <button
                    className={clsx(
                      styles.orgHeader,
                      isExpanded && styles.orgHeaderActive,
                    )}
                    onClick={(e) => toggleOrg(org.id, e)}
                    type="button"
                  >
                    <View direction="row" align="center" gap={3}>
                      <Icon name={org.logoIcon} size={20} />
                      <View grow>
                        <Text variant="body-2" weight="medium">
                          {org.name}
                        </Text>
                      </View>
                      <View>
                        <Icon
                          name={isExpanded ? 'chevron-down' : 'chevron-right'}
                          size={16}
                        />
                      </View>
                    </View>
                  </button>

                  {isExpanded && (
                    <View
                      direction="column"
                      className={styles.workspaceList}
                      padding={2}
                      gap={2}
                    >
                      {org.workspaces.map((ws) => {
                        const isSelected =
                          selectedOrgId === org.id &&
                          selectedWorkspaceId === ws.id;
                        return (
                          <Button
                            key={ws.id}
                            variant={isSelected ? 'faded' : 'ghost'}
                            onClick={() => handleSelectWorkspace(org.id, ws.id)}
                            type="button"
                            className={clsx(
                              styles.workspaceItem,
                              isSelected && styles.workspaceItemSelected,
                            )}
                          >
                            {ws.name}
                          </Button>
                        );
                      })}

                      <Divider />

                      <Button
                        variant="ghost"
                        type="button"
                        icon={<Icon name="plus" size={16} />}
                        attributes={{
                          style: {
                            textAlign: 'left',
                            justifyContent: 'flex-start',
                          },
                        }}
                      >
                        Add novo Projeto
                      </Button>
                    </View>
                  )}
                </div>
              );
            })}

            <Divider />

            <View padding={2} gap={2}>
              <Button
                variant="ghost"
                type="button"
                icon={<Icon name="plus" size={16} />}
                attributes={{
                  style: {
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                  },
                }}
              >
                Add novo Workspace
              </Button>
            </View>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  );
};
