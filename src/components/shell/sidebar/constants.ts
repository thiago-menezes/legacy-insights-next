import { NavSection } from './types';

export const NAVIGATION_SECTIONS: NavSection[] = [
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
      {
        label: 'Integrações',
        href: (projectId) => `/integracoes/projetos/${projectId}`,
        icon: 'arrows-exchange',
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
