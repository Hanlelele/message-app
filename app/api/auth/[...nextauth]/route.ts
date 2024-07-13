import bcrypt from 'bcrypt';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import prisma from '@/app/libs/prismadb';

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        // Xác thực tài khoản bằng Github
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),

        // Xác thực tài khoản bằng Google
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),

        // Xác thực tài khoản bằng email và mật khẩu

        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid Credentials');
                }

                // Tìm kiếm dùng dùng bằng email

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user?.hashedPassword) {
                    throw new Error('Invalid Credentials');
                }

                const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword);

                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials');
                }

                return user;
            },
        }),
    ],

    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt', //Lưu vào Cookies
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST };
