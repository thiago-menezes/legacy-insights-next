import { useEffect, useMemo, useState } from 'react';
import { InviteModalProps } from '.';
import { useSearchUser, useWorkspaceProjects } from '../api/query';
import { MemberRole } from '../types';

export const useInviteModal = ({
  scope,
  workspaceId,
  onSubmit,
  onClose,
  currentMembers = [],
}: Pick<
  InviteModalProps,
  'scope' | 'workspaceId' | 'onSubmit' | 'onClose' | 'currentMembers'
>) => {
  const [email, setEmail] = useState('');
  const [debouncedEmail, setDebouncedEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('member');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isValidEmail) {
        setDebouncedEmail(email);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [email, isValidEmail]);

  const {
    data: users,
    isLoading: isSearching,
    isError,
  } = useSearchUser(debouncedEmail, isValidEmail);

  const { data: projects = [], isLoading: isLoadingProjects } =
    useWorkspaceProjects(scope === 'workspace' ? workspaceId : undefined);

  const isSearchComplete =
    !isSearching &&
    !isError &&
    users !== undefined &&
    debouncedEmail !== '' &&
    debouncedEmail === email;

  const userExists = users && users.length > 0;
  const shouldCreateUser = isSearchComplete && !userExists;

  const isAlreadyMember = useMemo(() => {
    if (!email || !isValidEmail) return false;
    return currentMembers.some(
      (member) => member.email?.toLowerCase() === email.toLowerCase(),
    );
  }, [email, isValidEmail, currentMembers]);

  const resetForm = () => {
    setEmail('');
    setDebouncedEmail('');
    setRole('member');
    setSelectedProjects([]);
  };

  const handleSubmit = async () => {
    await onSubmit({
      email,
      role,
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
    if (email === '' || !isValidEmail || !debouncedEmail) return '';
    if (isAlreadyMember)
      return `Este usuário já é membro deste ${scopeLabel.toLowerCase()}.`;
    if (isError) return 'Erro ao verificar usuário. Verifique permissões.';
    if (isSearchComplete && !userExists) {
      return 'O usuário ainda não existe. Envie o link de criação de conta abaixo.';
    }
    if (isSearchComplete && userExists) {
      return `Usuário encontrado. Este usuário será convidado para o ${scopeLabel.toLowerCase()}.`;
    }
    return '';
  };

  return {
    email,
    setEmail,
    debouncedEmail,
    setDebouncedEmail,
    role,
    setRole,
    selectedProjects,
    setSelectedProjects,
    isValidEmail,
    isSearchComplete,
    userExists,
    shouldCreateUser,
    isAlreadyMember,
    handleSubmit,
    handleClose,
    scopeLabel,
    getHelperText,
    isLoadingProjects,
    projects,
    isSearching,
    isError,
    users,
  };
};
