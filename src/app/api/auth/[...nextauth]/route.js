import NextAuth from "next-auth"
import { authOptions } from "@/lib/authOptions";

const userList = [
    { name: "aditta", password: "123456" },
];

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }