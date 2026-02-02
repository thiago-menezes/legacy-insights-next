'use client';

import { PropsWithChildren } from 'react';
import Image from 'next/image';
import { Text, useTheme, View } from 'reshaped';
import styles from './styles.module.scss';
import { ThemeToggle } from '@/components/theme-toggle';

const AuthLayout = ({ children }: PropsWithChildren) => {
  const { colorMode } = useTheme();
  return (
    <section className={styles.section}>
      <div className={styles.leftContainer}>
        <div className={styles.backgroundPattern}></div>
        <div className={styles.backgroundGlow}></div>

        <View
          zIndex={10}
          padding={8}
          borderRadius="large"
          className={styles.metricsCard}
        >
          <View
            direction="row"
            justify="space-between"
            align="center"
            paddingBottom={6}
            className={styles.cardHeader}
          >
            <span style={{ color: 'var(--rs-color-white)' }}>
              MÉTRICAS EM TEMPO REAL
            </span>

            <View height={2} width={2} position="relative">
              <span className={styles.pingWrapper}>
                <span className={styles.pingAnimation}></span>
                <span className={styles.pingDot}></span>
              </span>
            </View>
          </View>

          <View direction="row" align="center" gap={4} padding={4}>
            <View
              width={12}
              height={12}
              borderRadius="circular"
              align="center"
              justify="center"
              className={styles.iconContainer}
            >
              <Image
                src="/icon-google.png"
                width={24}
                height={24}
                alt="Google"
              />
            </View>
            <div className={styles.separator}></div>
            <View
              width={12}
              height={12}
              borderRadius="circular"
              align="center"
              justify="center"
              className={styles.iconContainer}
            >
              <Image
                src="/icon-meta.png"
                width={24}
                height={24}
                style={{ height: 'auto' }}
                alt="Facebook"
              />
            </View>
          </View>

          <View gap={4}>
            <View direction="row" justify="space-between" align="end">
              <View>
                <span style={{ color: 'var(--rs-color-white)' }}>
                  ROI Total
                </span>
                <Text variant="title-3" weight="bold">
                  <span style={{ color: 'var(--rs-color-white)' }}>
                    +1,245%
                  </span>
                </Text>
              </View>

              <Text variant="body-3" className={styles.roiBadge} weight="bold">
                +32.5%
              </Text>
            </View>

            <View
              direction="row"
              align="end"
              gap={2}
              height={16}
              paddingTop={4}
            >
              <span
                className={styles.chartBar}
                style={{
                  height: '20px',
                }}
              ></span>
              <span
                className={styles.chartBar}
                style={{
                  height: '32px',
                }}
              ></span>
              <span
                className={styles.chartBar}
                style={{
                  height: '18px',
                }}
              ></span>
              <span
                className={styles.chartBar}
                style={{
                  height: '68px',
                }}
              ></span>
              <span
                className={styles.chartBar}
                style={{
                  height: '42px',
                }}
              ></span>
              <span
                className={styles.chartBar}
                style={{
                  height: '42px',
                }}
              ></span>
              <span className={styles.chartBarFull}></span>
            </View>
          </View>
        </View>

        <View
          className={styles.textCenter}
          align="center"
          zIndex={10}
          width="100%"
          textAlign="center"
        >
          <Text variant="title-6" weight="bold">
            Insights reais para decisões inteligentes.
          </Text>
          <View>
            <Text variant="body-2">
              Conecte suas contas e tenha uma visão unificada de todo o seu
              desempenho de marketing.
            </Text>
          </View>
        </View>
      </div>

      <div className={styles.loginSection}>
        <div className={styles.themeToggleContainer}>
          <ThemeToggle />
        </div>
        <div>
          <View paddingBottom={10} width="100%">
            <Image
              src={colorMode === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
              alt="Logo"
              width={800}
              height={800}
              style={{
                height: 'auto',
                maxWidth: '240px',
              }}
            />
          </View>

          {children}
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
