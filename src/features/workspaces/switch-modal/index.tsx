'use client';

import { Modal, View, Text, Button } from 'reshaped';
import Image from 'next/image';
import { Icon } from '@/components/icon';
import { getMediaUrl } from '@/libs/api/strapi';
import { Workspace } from '@/libs/api/services/workspaces';
import styles from '../styles.module.scss';

interface SwitchWorkspaceModalProps {
  active: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentWorkspace?: Workspace;
  pendingWorkspace?: Workspace | null;
}

export const SwitchWorkspaceModal = ({
  active,
  onClose,
  onConfirm,
  currentWorkspace,
  pendingWorkspace,
}: SwitchWorkspaceModalProps) => {
  return (
    <Modal active={active} onClose={onClose}>
      <Modal.Title>Trocar de Workspace</Modal.Title>
      <View padding={6} gap={6} align="center">
        <View direction="row" align="center" gap={4} justify="center">
          <View align="center" gap={2}>
            <div
              className={styles.workspaceIcon}
              style={{ width: 64, height: 64 }}
            >
              {currentWorkspace?.logo ? (
                <Image
                  src={getMediaUrl(currentWorkspace.logo.url) || ''}
                  alt={currentWorkspace.name}
                  width={64}
                  height={64}
                  style={{ borderRadius: 'inherit', objectFit: 'cover' }}
                  unoptimized
                />
              ) : (
                <Icon name="file-text" size={64} />
              )}
            </div>
            <Text variant="body-3" weight="medium" align="center">
              {currentWorkspace?.name}
            </Text>
          </View>

          <Icon name="arrows-right-left" size={24} />

          <View align="center" gap={2}>
            <div
              className={styles.workspaceIcon}
              style={{ width: 64, height: 64 }}
            >
              {pendingWorkspace?.logo ? (
                <Image
                  src={getMediaUrl(pendingWorkspace.logo.url) || ''}
                  alt={pendingWorkspace.name}
                  width={64}
                  height={64}
                  style={{ borderRadius: 'inherit', objectFit: 'cover' }}
                  unoptimized
                />
              ) : (
                <Icon name="file-text" size={64} />
              )}
            </div>
            <Text variant="body-3" weight="medium" align="center">
              {pendingWorkspace?.name}
            </Text>
          </View>
        </View>

        <Text align="center" variant="body-2">
          Você está entrando em um workspace que não é o workspace atual, deseja
          trocar de workspace e visualizar o conteúdo dele?
        </Text>

        <View direction="row" justify="center" gap={3} width="100%">
          <Button onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button color="primary" onClick={onConfirm} fullWidth>
            Trocar Workspace
          </Button>
        </View>
      </View>
    </Modal>
  );
};
