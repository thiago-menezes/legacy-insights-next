export interface HeaderProps {
  isVisible: boolean;
  onToggleSidebar: () => void;
  enterFullScreen: () => void;
  exitFullScreen: () => void;
  isMobile: boolean;
  sidebarVisible: boolean;
}
