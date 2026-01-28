import { useState } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  Modal,
  Select,
  TextField,
  View,
} from 'reshaped';
import styles from './styles.module.scss';
import { InviteFormData, MemberRole } from './types';

interface InviteModalProps {
  active: boolean;
  onClose: () => void;
  onSubmit: (data: InviteFormData) => Promise<void>;
  isPending: boolean;
  scope: 'workspace' | 'project';
}

export const InviteModal = ({
  active,
  onClose,
  onSubmit,
  isPending,
  scope,
}: InviteModalProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('member');
  const [createUser, setCreateUser] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    await onSubmit({
      email,
      role,
      password: createUser ? password : undefined,
      createUser,
    });
    resetForm();
  };

  const resetForm = () => {
    setEmail('');
    setRole('member');
    setCreateUser(false);
    setPassword('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const scopeLabel = scope === 'workspace' ? 'Workspace' : 'Projeto';

  return (
    <Modal active={active} onClose={handleClose}>
      <Modal.Title>Convidar para {scopeLabel}</Modal.Title>
      <View className={styles.modalContent}>
        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <TextField
            name="email"
            value={email}
            onChange={({ value }) => setEmail(value)}
            placeholder="exemplo@email.com"
            inputAttributes={{ type: 'email' }}
          />
          <FormControl.Helper>
            Se o usuário não existir, ele será criado automaticamente
          </FormControl.Helper>
        </FormControl>

        <FormControl>
          <FormControl.Label>Função</FormControl.Label>
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

        <Checkbox
          checked={createUser}
          onChange={({ checked }) => setCreateUser(checked)}
        >
          Definir senha manualmente (se o usuário não existir)
        </Checkbox>

        {createUser && (
          <View paddingTop={2}>
            <FormControl>
              <FormControl.Label>Senha</FormControl.Label>
              <TextField
                name="password"
                value={password}
                onChange={({ value }) => setPassword(value)}
                placeholder="Senha para o novo usuário"
                inputAttributes={{ type: 'password' }}
              />
              <FormControl.Helper>
                Deixe em branco para gerar uma senha aleatória
              </FormControl.Helper>
            </FormControl>
          </View>
        )}
      </View>

      <View className={styles.modalActions}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          loading={isPending}
          disabled={!email}
        >
          Enviar Convite
        </Button>
      </View>
    </Modal>
  );
};
