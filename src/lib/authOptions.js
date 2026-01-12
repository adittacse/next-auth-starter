import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

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
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        // ...add more providers here
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            try {
                const payload = {
                    ...user,
                    provider: account.provider,
                    providerId: account.providerAccountId,
                    role: "user",
                    createdAt: new Date().toISOString(),
                };

                if (!user?.email) {
                    return false;
                }

                const isExisting = await dbConnect("users").findOne({
                    email: user.email,
                    providerId: account.providerAccountId
                });

                if (!isExisting) {
                    const result = await dbConnect("users").insertOne(payload);
                }
                return true;
            } catch (error) {
                return false;
            }
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