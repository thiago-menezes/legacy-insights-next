import NextAuth, { NextAuthConfig, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { strapiLogin, StrapiAuthResponse } from '../api/strapi';
import { SessionUser } from '../api/types';

const config: NextAuthConfig = {
  providers: [
    // Strapi Credentials Provider
    Credentials({
      id: 'strapi',
      name: 'Strapi',
      credentials: {
        identifier: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        try {
          const response: StrapiAuthResponse = await strapiLogin(
            credentials.identifier as string,
            credentials.password as string,
          );

          if (response.jwt && response.user) {
            return {
              id: String(response.user.id),
              name: response.user.username,
              email: response.user.email,
              // Store Strapi JWT in user object for token callback
              strapiJwt: response.jwt,
            } as User & { strapiJwt: string };
          }

          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login', // Redirect errors to login page
  },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user }) {
      // Handle Strapi credentials login
      if (user && 'strapiJwt' in user) {
        token.accessToken = (user as { strapiJwt: string }).strapiJwt;
        token.provider = 'strapi';
        token.user = {
          id: user.id || '',
          name: user.name || null,
          email: user.email || null,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        const userData = token.user as SessionUser;
        if (userData.email) {
          session.user.id = userData.id;
          session.user.name = userData.name;
          session.user.email = userData.email;
        }
      }
      if (token.accessToken) {
        (session as { accessToken?: string }).accessToken =
          token.accessToken as string;
      }
      if (token.provider) {
        (session as { provider?: string }).provider = token.provider as string;
      }
      return session;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
