import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "./prisma";

export const authOptions = {
    providers: [

        CredentialsProvider({

            name: "credentials",

            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {

                if (!credentials.email || !credentials.password) {
                    throw new Error("Credenciales inválidas");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user) {
                    throw new Error("Usuario no encontrado");
                }

                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!passwordMatch) {
                    throw new Error("Contraseña incorrecta");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }

            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};