import Head from "next/head";
import Header from "@/components/Header";
import Link from "next/link";
import PostForm from "@/components/PostForm";
import { Button, Paper } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { InferGetServerSidePropsType } from "next";
import { Post as PostType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getServerSideProps(context: { params: { id: number } }) {
	const idParams = context.params.id;
	const id = Array.isArray(idParams) ? parseInt(idParams[0]) : 0;

	let post: (PostType | null) = null;

	if (!isNaN(id)) {
		post = await prisma.post.findUnique({ where: { id } })
	}

	return {
		props: {
			post: post ? JSON.stringify(post) : null
		}
	}
}

export default function (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const post: (PostType | null) = props.post ? JSON.parse(props.post) : null;

	return (
		<>
			<Head>
				<title>{post ? post.title.slice(0, 20) : 'Not Found'} | Edit | Prisma Blog</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<div style={{ textAlign: "center", marginTop: 32 }}>
				<Link href={"/posts/" + post?.id}>
					<Button variant="outlined" startIcon={<ChevronLeft />}>
						Go Back To Post
					</Button>
				</Link>
			</div>

			{
				post
					? (
						<Paper className="main" style={{ padding: 20, margin: "48px auto" }} elevation={4}>
							<PostForm type="edit" post={post} />
						</Paper>
					)
					: <p>not found</p>
			}
		</>
	)
}