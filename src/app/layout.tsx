import clsx from 'clsx';
import { Zalando_Sans_Expanded } from 'next/font/google';
import localFont from 'next/font/local';
import 'reshaped/bundle.css';
import './icon/tabler-300.css';
import '@/styles/global.scss';
import { Shell } from '@/components/shell';
import Providers from './providers';

const montserrat = Zalando_Sans_Expanded({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
  preload: true,
});

const zalando = Zalando_Sans_Expanded({
  subsets: ['latin'],
  variable: '--font-secondary',
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
      <body className={clsx(montserrat.className, zalando.className)}>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
