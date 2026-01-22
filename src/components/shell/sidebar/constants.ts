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
          { label: 'WhatsApp', href: '/campanhas/whatsapp' },
        ],
      },
      { label: 'Integrações', href: '/integracoes', icon: 'arrows-exchange' },
    ],
  },
  {
    title: 'Gestão',
    items: [
      { label: 'Financeiro', href: '/financeiro', icon: 'credit-card' },
      { label: 'Relatórios', href: '/relatorios', icon: 'file-text' },
      { label: 'Workspaces', href: '/workspaces', icon: 'file-text' },
    ],
  },
];
