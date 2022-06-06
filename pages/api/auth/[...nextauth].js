import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";

const env = process.env;
const is_dev = env.NODE_ENV === 'development';

export default NextAuth({
	providers: [
		GithubProvider({
			clientId: is_dev ? env.GITHUB_ID_LOCAL : env.GITHUB_ID_LIVE,
			clientSecret: is_dev ? env.GITHUB_SECRET_LOCAL : env.GITHUB_SECRET_LIVE,
		}),
		GoogleProvider({
			clientId: env.GOOGLE_ID,
			clientSecret: env.GOOGLE_SECRET
		})
	],
})