import { useState } from 'react';
import { Button, FormControl, Modal, Select, Text, View } from 'reshaped';
import styles from './styles.module.scss';
import { MemberRole, WorkspaceMemberItem } from './types';

interface EditRoleModalProps {
  active: boolean;
  onClose: () => void;
  onSubmit: (role: MemberRole) => Promise<void>;
  member: WorkspaceMemberItem | null;
  isPending: boolean;
}

interface EditRoleFormProps {
  initialRole: MemberRole;
  memberUsername: string;
  onSubmit: (role: MemberRole) => Promise<void>;
  onClose: () => void;
  isPending: boolean;
}

const EditRoleForm = ({
  initialRole,
  memberUsername,
  onSubmit,
  onClose,
  isPending,
}: EditRoleFormProps) => {
  const [role, setRole] = useState<MemberRole>(initialRole);

  const handleSubmit = async () => {
    await onSubmit(role);
  };

  return (
    <>
      <View className={styles.modalContent}>
        <Text>
          Alterar função de <strong>{memberUsername}</strong>
        </Text>

        <FormControl>
          <FormControl.Label>Nova Função</FormControl.Label>
          <Select
            name="role"
            value={role}
            onChange={({ value }) => setRole(value as MemberRole)}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'member', label: 'Membro' },
              { value: 'viewer', label: 'Visualizador' },
            ]}
          />
        </FormControl>
      </View>

      <View className={styles.modalActions}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="primary" onClick={handleSubmit} loading={isPending}>
          Salvar
        </Button>
      </View>
    </>
  );
};

export const EditRoleModal = ({
  active,
  onClose,
  onSubmit,
  member,
  isPending,
}: EditRoleModalProps) => {
  const initialRole =
    member?.role !== 'owner' ? (member?.role as MemberRole) : 'member';

  return (
    <Modal active={active} onClose={onClose}>
      <Modal.Title>Alterar Função</Modal.Title>
      {member && (
        <EditRoleForm
          key={member.id}
          initialRole={initialRole}
          memberUsername={member.username}
          onSubmit={onSubmit}
          onClose={onClose}
          isPending={isPending}
        />
      )}
    </Modal>
  );
};
