'use client';

import { PropsWithChildren, useEffect } from 'react';
import { View } from 'reshaped';
import Header from './header';
import { useShellState } from './hooks';
import Sidebar from './sidebar';
import styles from './style.module.scss';

export const Shell = ({ children }: PropsWithChildren) => {
  const {
    sidebarWidth,
    sidebarVisible,
    headerVisible,
    isResizing,
    isMobile,
    toggleSidebar,
    toggleFullscreen,
    startResize,
    stopResize,
    resize,
    enterFullScreen,
    exitFullScreen,
  } = useShellState();

  // Handle mouse move for resizing
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      resize(e.clientX);
    };

    const handleMouseUp = () => {
      stopResize();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resize, stopResize]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (!sidebarVisible || !headerVisible)) {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarVisible, headerVisible, toggleFullscreen]);

  return (
    <View direction="row" height="100vh" className={styles.shell}>
      <Sidebar
        isVisible={sidebarVisible}
        width={sidebarWidth}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      {sidebarVisible && !isMobile && (
        <div
          className={styles.resizeHandle}
          onMouseDown={startResize}
          style={{ cursor: isResizing ? 'col-resize' : 'col-resize' }}
        />
      )}

      {isMobile && sidebarVisible && (
        <div className={styles.backdrop} onClick={toggleSidebar} />
      )}

      <View grow direction="column" className={styles.mainWrapper}>
        <Header
          isVisible={headerVisible}
          onToggleSidebar={toggleSidebar}
          enterFullScreen={enterFullScreen}
          exitFullScreen={exitFullScreen}
          isMobile={isMobile}
        />
        <View
          as="main"
          grow
          padding={headerVisible ? 6 : 4}
          className={styles.content}
        >
          <View
            backgroundColor="neutral-faded"
            borderRadius="large"
            height="100%"
            padding={6}
            shadow="raised"
          >
            {children}
          </View>
        </View>
      </View>
    </View>
  );
};
