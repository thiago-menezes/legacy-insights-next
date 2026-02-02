import { useCallback, useEffect, useState } from 'react';
import { MOBILE_BREAKPOINT, STORAGE_KEY } from './constants';
import { ShellPreferences } from './types';
import { loadPreferences } from './utils';

export const useShellState = () => {
  const initialPrefs = loadPreferences();
  const [sidebarVisible, setSidebarVisible] = useState(
    initialPrefs.sidebarVisible,
  );
  const [headerVisible, setHeaderVisible] = useState(
    initialPrefs.headerVisible,
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previousSidebarVisible, setPreviousSidebarVisible] = useState(true);
  const [previousHeaderVisible, setPreviousHeaderVisible] = useState(true);

  useEffect(() => {
    const prefs: ShellPreferences = {
      sidebarVisible,
      headerVisible,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [sidebarVisible, headerVisible]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarVisible((prev) => !prev);
  }, []);

  const toggleHeader = useCallback(() => {
    setHeaderVisible((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      setPreviousSidebarVisible(sidebarVisible);
      setPreviousHeaderVisible(headerVisible);
      setSidebarVisible(false);
      setHeaderVisible(false);
      setIsFullscreen(true);
    } else {
      setSidebarVisible(true);
      setHeaderVisible(true);
      setIsFullscreen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen, sidebarVisible, headerVisible, previousHeaderVisible]);

  const enterFullScreen = useCallback(() => {
    setPreviousSidebarVisible(sidebarVisible);
    setPreviousHeaderVisible(headerVisible);
    setSidebarVisible(false);
    setHeaderVisible(false);
    setIsFullscreen(true);
  }, [sidebarVisible, headerVisible]);

  const exitFullScreen = () => {
    setSidebarVisible(previousSidebarVisible);
    setHeaderVisible(previousHeaderVisible);
    setIsFullscreen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (!sidebarVisible || !headerVisible)) {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarVisible, headerVisible, toggleFullscreen]);

  return {
    sidebarVisible,
    headerVisible,
    isMobile,
    toggleSidebar,
    toggleHeader,
    toggleFullscreen,
    enterFullScreen,
    exitFullScreen,
  };
};
