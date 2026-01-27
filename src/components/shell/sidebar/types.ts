import { IconNames } from '@/components/icon';
import { StrapiWorkspace } from '@/libs/api/workspaces';

export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: ((projectId: string) => string) | string;
  icon: IconNames;
  expandable?: boolean;
  subItems?: ((workspaces: StrapiWorkspace[]) => NavSubItem[]) | NavSubItem[];
}

export interface SidebarProps {
  isVisible: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export interface NavSection {
  title?: string;
  items: ((workspaces: StrapiWorkspace[]) => NavItem[]) | NavItem[];
}
