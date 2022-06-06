import Head from 'next/head'
import { PrismaClient, Post } from '@prisma/client'
import Header from '../components/Header';
import { getSession, useSession } from 'next-auth/react';

const prisma = new PrismaClient();

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx);
	const authorMail = session?.user?.email || "";
	const posts: Post[] = await prisma.post.findMany({ where: { authorMail } });
	return { props: { posts } }
}

export default function Home(props: { posts: Post[] }) {
	const { posts } = props;

	return (
		<div>
			<Head>
				<title>Blog</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<div>
				{
					posts.length === 0
						? <p style={{ textAlign: "center" }}>No posts. Yet...</p>
						: posts.map(post => (
							<div key={post.id}>
								<h2>{post.title}</h2>
								<p>{post.content}</p>
							</div>
						))
				}
			</div>
		</div>
	)
}
