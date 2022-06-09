import Head from 'next/head'
import Post from '@/components/Post';
import PageHeader from '@/components/PageHeader';
import { Key } from 'react';
import { InferGetServerSidePropsType } from "next";
import { PrismaClient, Post as PostType } from '@prisma/client'
import { useRouter } from 'next/router';
import { Pagination, Stack } from '@mui/material';

const prisma = new PrismaClient();
const pageLength = 3;

export async function getServerSideProps(context: { query?: { page?: string, query?: string } }) {
	let page = context?.query?.page ? parseInt(context.query.page) : 1;
	page = Math.max(page, 1); // page can't be less than 1

	let searchQuery = context?.query?.query || "";

	if (!searchQuery) {
		return {
			props: {
				posts: "[]",
				postCount: 0,
			}
		}
	}

	const where = {
		OR: [
			{ title: { contains: searchQuery, } },
			{ content: { contains: searchQuery, } }
		]
	}

	const posts: PostType[] = await prisma.post.findMany({
		orderBy: { updatedAt: 'desc' },
		where: where,
		skip: pageLength * (page - 1),
		take: pageLength,
	});

	const postCount: number = await prisma.post.count({ where });

	return {
		props: {
			posts: JSON.stringify(posts),
			postCount,
		}
	}
}

export default function (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const posts = JSON.parse(props.posts);
	const pageCount = Math.ceil(props.postCount / pageLength);
	const router = useRouter();
	const page = router?.query?.page ? parseInt(router.query.page.toString()) : 1;
	const searchQuery = router?.query?.query || "";

	const OnPageChange = (value: number) => {
		router.push({ query: { page: value, query: searchQuery } })
	}

	const PaginationComponent = () => {
		return pageCount ? <Pagination
			count={pageCount}
			onChange={(_, value: number) => OnPageChange(value)}
			defaultPage={page}
			defaultValue={page}
			style={{ margin: "24px 0", display: "flex", justifyContent: "center" }}
		/> : null
	}

	return (
		<div>
			<Head>
				<title>Prisma Blog by Berkin AKKAYA</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<PageHeader>Search Results</PageHeader>

			<main className="main">
				<Stack spacing={3} className="post-holder">
					{
						(posts.length === 0) // if there is no results...
							? <p className="text-center">No posts found...</p>
							: posts.map((post: PostType, i: Key) => <Post postInfo={post} key={i} />)
					}
				</Stack>

				<PaginationComponent />
			</main>
		</div>
	)
}