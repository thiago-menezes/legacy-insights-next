import clsx from 'clsx';
import { Montserrat } from 'next/font/google';
import localFont from 'next/font/local';
import 'reshaped/bundle.css';
import '@/styles/global.scss';
import './icon/tabler-300.css';
import Providers from './providers';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true,
});

const newBlackTypeface = localFont({
  src: [
    {
      path: './fonts/NewBlackTypeface-UltraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/NewBlackTypeface-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/NewBlackTypeface-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/NewBlackTypeface-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/NewBlackTypeface-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/NewBlackTypeface-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/NewBlackTypeface-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-new-black-typeface',
  display: 'swap',
  preload: true,
});

const tablerIcons = localFont({
  src: [
    {
      path: './icon/fonts/tabler-icons-300-outline.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-tabler-icons',
  display: 'swap',
  preload: true,
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="pt-BR" className={tablerIcons.variable}>
      <body className={clsx(montserrat.variable, newBlackTypeface.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
