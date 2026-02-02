'use client';

import { Button, Modal, Text, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { StrapiProject } from '@/libs/api/services/projects';
import styles from '../../workspaces/styles.module.scss';

interface SwitchProjectModalProps {
  active: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentProject?: StrapiProject;
  pendingProject?: StrapiProject;
}

export const SwitchProjectModal = ({
  active,
  onClose,
  onConfirm,
  currentProject,
  pendingProject,
}: SwitchProjectModalProps) => {
  return (
    <Modal active={active} onClose={onClose}>
      <Modal.Title>Trocar de Projeto</Modal.Title>
      <View padding={6} gap={6} align="center">
        <View direction="row" align="center" gap={4} justify="center">
          <View align="center" gap={2}>
            <div
              className={styles.workspaceIcon}
              style={{ width: 64, height: 64 }}
            >
              <Icon name="folder" size={64} />
            </div>
            <Text variant="body-3" weight="medium" align="center">
              {currentProject?.name}
            </Text>
          </View>

          <Icon name="arrows-right-left" size={24} />

          <View align="center" gap={2}>
            <div
              className={styles.workspaceIcon}
              style={{ width: 64, height: 64 }}
            >
              <Icon name="folder" size={64} />
            </div>
            <Text variant="body-3" weight="medium" align="center">
              {pendingProject?.name}
            </Text>
          </View>
        </View>

        <Text align="center" variant="body-2">
          Você está entrando em um projeto que não é o projeto atual, deseja
          trocar de projeto e visualizar o conteúdo dele?
        </Text>

        <View direction="row" justify="center" gap={3} width="100%">
          <Button onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button color="primary" onClick={onConfirm} fullWidth>
            Trocar Projeto
          </Button>
        </View>
      </View>
    </Modal>
  );
};
