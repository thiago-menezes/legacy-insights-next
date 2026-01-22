import { IconProps } from '@/components/icon';

export const NAV_ITEMS: {
  label: string;
  href: string;
  icon: IconProps['name'];
}[] = [
  { label: 'Dashboard', href: '/', icon: 'layout-dashboard' },
  { label: 'Campaigns', href: '/campaigns', icon: 'telescope' },
  { label: 'Integrations', href: '/integrations', icon: 'plug' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
];
