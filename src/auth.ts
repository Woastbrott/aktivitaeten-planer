import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email
        const password = credentials?.password

        if (typeof email !== "string" || typeof password !== "string") {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) return null

        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user?.id) {
        token.id = user.id
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
