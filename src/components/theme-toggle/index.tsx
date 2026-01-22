'use client';

import clsx from 'clsx';
import { useTheme } from 'reshaped';
import { Icon } from '../icon';
import styles from './styles.module.scss';

export const ThemeToggle = () => {
  const { colorMode, invertColorMode } = useTheme();
  const isDark = colorMode === 'dark';

  return (
    <button
      className={styles.toggle}
      onClick={invertColorMode}
      aria-label="Toggle theme"
      type="button"
    >
      <div
        className={clsx(styles.iconWrapper, !isDark ? styles.iconActive : '')}
      >
        <Icon name="sun" />
      </div>

      <div
        className={clsx(styles.iconWrapper, isDark ? styles.iconActive : '')}
      >
        <Icon name="moon" />
      </div>

      <span className={clsx(styles.thumb, isDark ? styles.thumbDark : '')} />
    </button>
  );
};
