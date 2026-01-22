import { IconNames } from '@/components/icon';

export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: IconNames;
  expandable?: boolean;
  subItems?: NavSubItem[];
}

export interface SidebarProps {
  isVisible: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}
