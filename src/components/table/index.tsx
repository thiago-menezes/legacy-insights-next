import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { useTheme } from 'reshaped';

ModuleRegistry.registerModules([AllCommunityModule]);

export const Table = <T,>(props: AgGridReactProps<T>) => {
  const { colorMode } = useTheme();

  const legacyTheme = themeQuartz.withParams({
    accentColor: 'var(--rs-color-background-primary)',
    backgroundColor: 'var(--rs-color-background-elevation-base)',
    browserColorScheme: colorMode,
    chromeBackgroundColor: 'var(--rs-color-background-neutral-faded)',
    foregroundColor: 'var(--rs-color-foreground-neutral)',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 14,
    cellHorizontalPadding: 'var(--rs-unit-x4)',
  });

  return <AgGridReact {...props} theme={legacyTheme} />;
};
