import { useState, useEffect } from 'react';
import { Button, FormControl, Modal, Select, TextField, View } from 'reshaped';
import { useSearchUser, useWorkspaceProjects } from './api/query';
import { ProjectSelector } from './project-selector';
import { InviteFormData, MemberRole } from './types';

interface InviteModalProps {
  active: boolean;
  onClose: () => void;
  onSubmit: (data: InviteFormData) => Promise<void>;
  isPending: boolean;
  scope: 'workspace' | 'project';
  workspaceId?: string; // Required when scope is 'workspace'
}

export const InviteModal = ({
  active,
  onClose,
  onSubmit,
  isPending,
  scope,
  workspaceId,
}: InviteModalProps) => {
  const [email, setEmail] = useState('');
  const [debouncedEmail, setDebouncedEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('member');
  const [password, setPassword] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  // Debounce email
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmail(email);
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

  const {
    data: users,
    isLoading: isSearching,
    isError,
  } = useSearchUser(debouncedEmail);

  const { data: projects = [], isLoading: isLoadingProjects } =
    useWorkspaceProjects(scope === 'workspace' ? workspaceId : undefined);

  // Derive state
  // Search is complete only if we have data and no errors
  const isSearchComplete =
    !isSearching &&
    !isError &&
    users !== undefined &&
    debouncedEmail !== '' &&
    debouncedEmail === email;

  const userExists = users && users.length > 0;
  const shouldCreateUser = isSearchComplete && !userExists;

  const resetForm = () => {
    setEmail('');
    setDebouncedEmail('');
    setRole('member');
    setPassword('');
    setSelectedProjects([]);
  };

  const handleSubmit = async () => {
    await onSubmit({
      email,
      role,
      password: shouldCreateUser ? password : undefined,
      createUser: shouldCreateUser,
      projects: scope === 'workspace' ? selectedProjects : undefined,
    });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const scopeLabel = scope === 'workspace' ? 'Workspace' : 'Projeto';

  const getHelperText = () => {
    if (isSearching) return 'Verificando usuário...';
    if (isError) return 'Erro ao verificar usuário. Verifique permissões.';
    if (debouncedEmail && debouncedEmail === email && !userExists) {
      return 'Usuário não encontrado. Digite uma senha para criar a conta.';
    }
    return 'Se o usuário não existir, solicitaremos uma senha';
  };

  return (
    <Modal active={active} onClose={handleClose}>
      <Modal.Title>Convidar para {scopeLabel}</Modal.Title>
      <View gap={3} paddingTop={4} paddingBottom={4}>
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
            <span
              style={{
                color: isError ? 'var(--rs-color-critical)' : undefined,
              }}
            >
              {getHelperText()}
            </span>
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

        {scope === 'workspace' && (
          <ProjectSelector
            projects={projects}
            selectedProjects={selectedProjects}
            onChange={setSelectedProjects}
            isLoading={isLoadingProjects}
          />
        )}

        {shouldCreateUser && (
          <View paddingTop={2}>
            <FormControl>
              <FormControl.Label>Senha *</FormControl.Label>
              <TextField
                name="password"
                value={password}
                onChange={({ value }) => setPassword(value)}
                placeholder="Senha para o novo usuário"
                inputAttributes={{ type: 'password', required: true }}
              />
              <FormControl.Helper>
                Digite a senha que será passada ao novo usuário
              </FormControl.Helper>
            </FormControl>
          </View>
        )}
      </View>

      <View gap={3} direction="row" justify="end">
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          loading={isPending}
          disabled={
            !isSearchComplete ||
            (scope === 'workspace' && selectedProjects.length === 0) ||
            (shouldCreateUser && !password.trim())
          }
        >
          {shouldCreateUser ? 'Criar e Convidar' : 'Enviar Convite'}
        </Button>
      </View>
    </Modal>
  );
};
