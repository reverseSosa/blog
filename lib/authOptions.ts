import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import prismadb from "@/lib/prismadb";

export const authOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				username: { label: "Username", type: "text", placeholder: "alex" },
				password: { label: "Password", type: "password" },
				email: { label: "Email", type: "email" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					return null;
				}
				const _email = credentials.email.toLowerCase();
				const user = await prismadb.user.findUnique({
					where: {
						email: _email,
					},
				});

				if (!user) {
					return null;
				}

				const passwordsMatch = await bcrypt.compare(
					credentials.password,
					user.password!,
				);

				if (!passwordsMatch) {
					return null;
				}

				return user;
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === "development",
	pages: {
		signIn: "/login",
	},
};
