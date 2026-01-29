import { Button, Modal, Text, View } from 'reshaped';
import { Workspace } from '@/libs/api/services/workspaces';

interface DeleteWorkspaceModalProps {
  active: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workspace: Workspace | null;
  isPending: boolean;
}

export const DeleteWorkspaceModal = ({
  active,
  onClose,
  onConfirm,
  workspace,
  isPending,
}: DeleteWorkspaceModalProps) => {
  const hasProjects = (workspace?.projects?.length || 0) > 0;

  return (
    <Modal active={active} onClose={onClose}>
      <Modal.Title>Excluir Workspace</Modal.Title>
      <View gap={3} paddingTop={4} paddingBottom={4}>
        {hasProjects ? (
          <div>
            <Text color="critical" weight="bold">
              Este workspace não pode ser excluído pois ele possui projetos
              cadastrados.
            </Text>
            <Text color="neutral">
              Exclua todos os projetos para prosseguir com a exclusão deste
              workspace.
            </Text>
          </div>
        ) : (
          <div>
            <Text>
              Tem certeza que deseja excluir o workspace{' '}
              <strong>{workspace?.name}</strong>?
            </Text>
            <Text color="neutral">
              Esta ação não pode ser desfeita. Todos os recursos deste workspace
              serão excluídos permanentemente.
            </Text>
          </div>
        )}
      </View>

      <View gap={3} direction="row" justify="end">
        <Button onClick={onClose}>
          {hasProjects ? 'Entendido' : 'Cancelar'}
        </Button>
        {!hasProjects && (
          <Button color="critical" onClick={onConfirm} loading={isPending}>
            Excluir
          </Button>
        )}
      </View>
    </Modal>
  );
};
