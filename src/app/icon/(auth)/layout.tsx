import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/libs/auth';

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return (
    <>
      Você está autenticado
      <main>{children}</main>
    </>
  );
}
