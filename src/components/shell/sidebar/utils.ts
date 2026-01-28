import { NavSection } from './types';

export const buildNavigationSections = (
  workspaceSlug?: string,
  projectSlug?: string,
  hasWorkspaces?: boolean,
  hasProjects?: boolean,
): NavSection[] => {
  const sections: NavSection[] = [
    {
      title: 'Menu',
      items: [
        { label: 'Dashboard', href: '/', icon: 'chart-pie' },
        {
          label: 'Campanhas',
          href: '/campanhas',
          icon: 'chart-line',
          expandable: true,
          subItems: [
            { label: 'Meta', href: '/campanhas/meta' },
            { label: 'Google', href: '/campanhas/google' },
          ],
        },
      ],
    },
    {
      title: 'Gestão',
      items: [
        {
          label: 'Workspaces',
          href: '/workspaces',
          icon: 'file-text',
          expandable: false,
        },
      ],
    },
  ];

  const gestaoSection = sections.find((s) => s.title === 'Gestão');

  if (gestaoSection) {
    gestaoSection.items.push({
      label: 'Projetos',
      href: `/workspaces/${workspaceSlug}`,
      icon: 'folders',
      disabled: !hasWorkspaces,
      disabledTooltip: !hasWorkspaces
        ? 'Você ainda não possui workspaces'
        : undefined,
    });

    gestaoSection.items.push({
      label: 'Integrações',
      href: `/workspaces/${workspaceSlug}/${projectSlug}`,
      icon: 'arrows-exchange',
      disabled: !hasProjects,
      disabledTooltip: !hasProjects
        ? 'Você ainda não possui projetos cadastrados nesse workspace'
        : undefined,
    });

    gestaoSection.items.push({
      label: 'Usuários',
      href: '/usuarios',
      icon: 'users',
      disabled: !hasWorkspaces,
      disabledTooltip: !hasWorkspaces
        ? 'Você ainda não possui workspaces'
        : undefined,
    });
  }

  return sections;
};
