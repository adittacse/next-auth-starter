import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from 'bcryptjs';

const userList = [
    { name: "aditta", password: "123456" },
];

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // Sign in with {name} button
            name: 'Credentials',

            // form inputs
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Enter Email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // my own login logic
                const { email, password } = credentials;
                // const user = userList.find(user => user.name === username);
                const user = await dbConnect("users").findOne({ email });
                if (!user) {
                    return null;
                }
                // const isPasswordMatched = user.password === password;
                const isPasswordMatched = await bcrypt.compare(password, user.password);
                if (isPasswordMatched) {
                    return user;
                }
                return null
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
        // ...add more providers here
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },

        async redirect({ url, baseUrl }) {
            return baseUrl
        },

        async session({ session, token, user }) {
            if (token) {
                session.role = token.role;
            }
            return session
        },

        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.email = user.email;
                token.role = user.role;
            }
            return token
        }
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }