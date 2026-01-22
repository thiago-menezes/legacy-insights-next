'use client';

import { Button, useTheme } from 'reshaped';
import { Icon } from './icon';

export const ThemeToggle = () => {
  const { colorMode, invertColorMode } = useTheme();

  return (
    <Button variant="ghost" onClick={invertColorMode} aria-label="Toggle theme">
      <Icon name={colorMode === 'dark' ? 'sun' : 'moon'} />
    </Button>
  );
};
