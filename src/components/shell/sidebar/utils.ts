import { NavSection } from './types';

export const buildNavigationSections = (
  workspaceSlug?: string,
  projectSlug?: string,
  hasWorkspaces?: boolean,
  hasProjects?: boolean,
  canManage?: boolean,
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
  ];

  // Only show management section if user has management permissions
  if (canManage) {
    sections.push({
      title: 'Gestão',
      items: [
        {
          label: 'Workspaces',
          href: '/workspaces',
          icon: 'file-text',
          expandable: false,
        },
      ],
    });

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
        label: 'Produtos',
        href: `/workspaces/${workspaceSlug}/${projectSlug}/products`,
        icon: 'package',
        disabled: !hasProjects,
        disabledTooltip: !hasProjects
          ? 'Você ainda não possui projetos cadastrados nesse workspace'
          : undefined,
      });
    }
  }

  // Add Settings section at the bottom
  sections.push({
    title: '',
    items: [
      {
        label: 'Configurações',
        href: '/settings',
        icon: 'settings',
        expandable: false,
      },
    ],
  });

  return sections;
};
