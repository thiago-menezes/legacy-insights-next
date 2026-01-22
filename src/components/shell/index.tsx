'use client';

import { PropsWithChildren } from 'react';
import { View } from 'reshaped';
import { Header } from './header';
import { useShellState } from './hooks';
import { Sidebar } from './sidebar';
import styles from './styles.module.scss';

export const Shell = ({ children }: PropsWithChildren) => {
  const {
    sidebarVisible,
    headerVisible,
    isMobile,
    toggleSidebar,
    enterFullScreen,
    exitFullScreen,
  } = useShellState();

  return (
    <View direction="row" height="100vh" className={styles.shell}>
      <Sidebar
        isVisible={sidebarVisible}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

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
          sidebarVisible={sidebarVisible}
        />
        <View
          as="main"
          grow
          padding={headerVisible ? 4 : 2}
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
