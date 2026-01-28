import { Button, Modal, Text, View } from 'reshaped';
import styles from './styles.module.scss';
import { WorkspaceMemberItem } from './types';

interface RemoveModalProps {
  active: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  member: WorkspaceMemberItem | null;
  isPending: boolean;
  scope: 'workspace' | 'project';
}

export const RemoveModal = ({
  active,
  onClose,
  onConfirm,
  member,
  isPending,
  scope,
}: RemoveModalProps) => {
  const scopeLabel = scope === 'workspace' ? 'workspace' : 'projeto';

  return (
    <Modal active={active} onClose={onClose}>
      <Modal.Title>Remover Membro</Modal.Title>
      <View className={styles.modalContent}>
        <Text>
          Tem certeza que deseja remover <strong>{member?.username}</strong>{' '}
          deste {scopeLabel}?
        </Text>
        <Text color="neutral">
          Esta ação não pode ser desfeita. O usuário perderá acesso a todos os
          recursos do {scopeLabel}.
        </Text>
      </View>

      <View className={styles.modalActions}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="critical" onClick={onConfirm} loading={isPending}>
          Remover
        </Button>
      </View>
    </Modal>
  );
};
