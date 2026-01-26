import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { Shell } from '@/components/shell';
import { auth } from '@/libs/auth';

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <Shell>{children}</Shell>;
}
