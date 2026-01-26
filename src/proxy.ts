export { auth as proxy } from '@/libs/auth';

export const config = {
  // Pattern to skip auth check for internal next.js files, api, images, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
