import { PrismaClient, Post as PostType } from '@prisma/client'
import { getSession, GetSessionParams, useSession } from 'next-auth/react';
import { InferGetServerSidePropsType } from "next";
import { Paper, Stack } from '@mui/material';
import { Key } from 'react';
import Head from 'next/head'
import Post from '@/components/Post';
import PageHeader from '@/components/PageHeader';

const prisma = new PrismaClient();

export async function getServerSideProps(ctx: GetSessionParams) {
	const session = await getSession(ctx);
	const authorMail = session?.user?.email || "";
	const posts: PostType[] = await prisma.post.findMany({ where: { authorMail }, orderBy: { updatedAt: 'desc' } });
	return { props: { posts: JSON.stringify(posts) } }
}

export default function (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const posts = JSON.parse(props.posts);
	const { status: authStatus } = useSession();

	let content = authStatus === "authenticated" ? (
		<main className="main">
			<Stack spacing={3} className="post-holder">
				{
					posts.length === 0
						? <p className="text-center">You have no posts. Yet...</p>
						: posts.map((post: PostType, i: Key) => (
							<Post postInfo={post} key={i} />
						))
				}
			</Stack>
		</main>
	) : <p className="text-center">You must be signed in to view this page...</p>

	return (
		<div>
			<Head>
				<title>Prisma Blog - My Posts</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<PageHeader>My Posts</PageHeader>

			{content}
		</div>
	)
}
