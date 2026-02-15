import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
    providers: [
        Credentials({
            async authorize(credentials) {
                const adminUser = process.env.ADMIN_USERNAME || "admin";
                const adminPass = process.env.ADMIN_PASSWORD || "piggy-admin-pass";

                if (
                    credentials?.username === adminUser &&
                    credentials?.password === adminPass
                ) {
                    return {
                        id: "1",
                        name: "Piggy Admin",
                        email: "admin@piggydao.com",
                        role: "admin",
                    };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
} satisfies NextAuthConfig
