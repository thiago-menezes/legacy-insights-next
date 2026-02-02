import { generateThemeColors } from 'reshaped/themes';

const config = {
  themes: {
    legacy: {
      color: generateThemeColors({ primary: '#1C43F4' }),
      fontFamily: {
        body: {
          family: 'Montserrat, sans-serif',
        },
        heading: {
          family: 'Montserrat, sans-serif',
        },
        title: {
          family: 'newBlackTypeface, sans-serif',
        },
      },
      radius: {
        small: {
          px: 8,
        },
        medium: {
          px: 12,
        },
        large: {
          px: 16,
        },
      },
    },
  },
};

export default config;
