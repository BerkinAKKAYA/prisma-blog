import { PrismaClient, Post as PostType } from '@prisma/client'
import { getSession, GetSessionParams, useSession } from 'next-auth/react';
import { InferGetServerSidePropsType } from "next";
import { Stack } from '@mui/material';
import { Key } from 'react';
import Head from 'next/head'
import Header from '../components/Header';
import Post from '@/components/Post';
import PageHeader from '@/components/PageHeader';

const prisma = new PrismaClient();

export async function getServerSideProps(ctx: GetSessionParams) {
	const session = await getSession(ctx);
	const authorMail = session?.user?.email || "";
	const posts: PostType[] = await prisma.post.findMany({ where: { authorMail }, orderBy: { updatedAt: 'desc' } });
	return { props: { posts: JSON.stringify(posts) } }
}

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const posts = JSON.parse(props.posts);

	return (
		<div>
			<Head>
				<title>Prisma Blog - My Posts</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<PageHeader>My Posts</PageHeader>

			<Stack spacing={3} className="post-holder">
				{
					posts.length === 0
						? <p style={{ textAlign: "center" }}>Nobody posted anything. Yet...</p>
						: posts.map((post: PostType, i: Key) => (
							<Post postInfo={post} key={i} />
						))
				}
			</Stack>
		</div>
	)
}
