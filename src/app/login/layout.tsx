'use client';

import { PropsWithChildren } from 'react';
import { View } from 'reshaped';
import styles from '@/features/auth/styles.module.scss';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <View className={styles.authLayout}>
      <View className={styles.authCard}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
