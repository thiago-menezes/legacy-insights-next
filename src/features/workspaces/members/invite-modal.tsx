import { useState } from 'react';
import { Button, FormControl, Modal, TextField, Select, View } from 'reshaped';
import { WorkspaceRole } from '@/libs/api/services/workspaces/types';
import { useInviteMember } from './api/mutation';

interface InviteMemberModalProps {
  active: boolean;
  onClose: () => void;
  workspaceId: string;
}

export const InviteMemberModal = ({
  active,
  onClose,
  workspaceId,
}: InviteMemberModalProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<WorkspaceRole>('member');
  const { mutateAsync: inviteMember, isPending } = useInviteMember(workspaceId);

  const handleSubmit = async () => {
    await inviteMember({ email, role });
    onClose();
    setEmail('');
    setRole('member');
  };

  return (
    <Modal active={active} onClose={onClose}>
      <Modal.Title>Convidar Membro</Modal.Title>
      <View gap={4} paddingTop={4}>
        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <TextField
            name="email"
            value={email}
            onChange={({ value }) => setEmail(value)}
            placeholder="exemplo@email.com"
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Função</FormControl.Label>
          <Select
            name="role"
            value={role}
            onChange={({ value }) => setRole(value as WorkspaceRole)}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'member', label: 'Membro' },
              { value: 'viewer', label: 'Visualizador' },
            ]}
          />
        </FormControl>
      </View>

      <View direction="row" gap={2} justify="center" align="center" padding={4}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="primary" onClick={handleSubmit} loading={isPending}>
          Enviar Convite
        </Button>
      </View>
    </Modal>
  );
};
