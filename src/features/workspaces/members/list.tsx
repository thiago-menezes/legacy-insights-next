import { useState } from 'react';
import { View, Text, Button, Loader, Badge, ActionBar } from 'reshaped';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { useWorkspaceMembers } from './api/query';
import { InviteMemberModal } from './invite-modal';

interface WorkspaceMembersListProps {
  workspaceId: string;
  workspaceOwnerId?: number;
}

export const WorkspaceMembersList = ({
  workspaceId,
  workspaceOwnerId,
}: WorkspaceMembersListProps) => {
  const { data: members, isLoading } = useWorkspaceMembers(workspaceId);
  const [isInviteModalActive, setIsInviteModalActive] = useState(false);

  if (isLoading) {
    return (
      <View align="center" padding={4}>
        <Loader />
      </View>
    );
  }

  return (
    <View gap={4}>
      <ActionBar>
        <View
          direction="row"
          align="center"
          justify="space-between"
          width="100%"
        >
          <Text variant="featured-3">Membros do Workspace</Text>
          <Button
            color="primary"
            icon={<Icon name="plus" size={18} />}
            onClick={() => setIsInviteModalActive(true)}
          >
            Convidar Membro
          </Button>
        </View>
      </ActionBar>

      <View gap={2} direction="column">
        {members?.map((member) => (
          <View
            key={member.id}
            direction="row"
            align="center"
            justify="space-between"
            padding={3}
            backgroundColor="neutral-faded"
            borderRadius="medium"
          >
            <View direction="column">
              <Text weight="medium">{member.username}</Text>
              <Text variant="caption-1" color="neutral-faded">
                {member.email}
              </Text>
            </View>
            <View direction="row" align="center" gap={3}>
              <Badge
                color={
                  member.role === 'admin' ||
                  (workspaceOwnerId && member.id === workspaceOwnerId)
                    ? 'primary'
                    : 'neutral'
                }
              >
                {workspaceOwnerId && member.id === workspaceOwnerId
                  ? 'Owner'
                  : member.role || 'Member'}
              </Badge>
              {!(workspaceOwnerId && member.id === workspaceOwnerId) && (
                <Button
                  icon={<Icon name="trash" size={16} />}
                  variant="ghost"
                  color="critical"
                  onClick={() => {
                    /* TODO: Implement remove member */
                  }}
                />
              )}
            </View>
          </View>
        ))}
        {members?.length === 0 && (
          <EmptyState icon="user" title="Nenhum membro encontrado" />
        )}
      </View>

      <InviteMemberModal
        active={isInviteModalActive}
        onClose={() => setIsInviteModalActive(false)}
        workspaceId={workspaceId}
      />
    </View>
  );
};
