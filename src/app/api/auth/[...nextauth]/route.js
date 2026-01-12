import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const userList = [
    { name: "aditta", password: "123456" },
]

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // Sign in with {name} button
            name: 'Credentials',

            // form inputs
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // my own login logic
                const { username, password } = credentials;
                const user = userList.find(user => user.name === username);
                if (!user) {
                    return null;
                }
                const isPasswordOk = user.password === password;
                if (isPasswordOk) {
                    return user;
                }
                return null
            }
        }),
        // ...add more providers here
    ],
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }