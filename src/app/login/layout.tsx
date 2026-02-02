'use client';

import { PropsWithChildren } from 'react';
import Image from 'next/image';
import { View, useTheme } from 'reshaped';
import styles from '@/features/auth/styles.module.scss';

const AuthLayout = ({ children }: PropsWithChildren) => {
  const { colorMode } = useTheme();

  return (
    <View className={styles.authLayout}>
      <View className={styles.authCard}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Image
              src={colorMode === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
              alt="Logo"
              width={24}
              height={24}
            />
          </div>
          <span className={styles.logoText}>
            Legacy<span className={styles.logoTextAccent}>Insight</span>
          </span>
        </div>
        {children}
      </View>
    </View>
  );
};

export default AuthLayout;
