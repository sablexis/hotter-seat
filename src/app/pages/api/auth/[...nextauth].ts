import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from '../../../lib/mongodb';
import { Session } from "inspector/promises";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        session: async ({session, user}) => {
                session.user.id = user.id;
                return session;
        },
    },
});