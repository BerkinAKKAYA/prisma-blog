import Head from "next/head";
import Link from "next/link";
import PostForm from "@/components/PostForm";
import { Button, Paper } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { InferGetServerSidePropsType } from "next";
import { Post as PostType, PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";

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
	const post: (PostType | null) = props?.post ? JSON.parse(props.post) : null;
	const { data: sessionData, status: authStatus } = useSession();
	let content: JSX.Element | null = null;
	let title: string | null = "";

	if (!post) {
		title = "Not Found";
		content = <p className="text-center">Post does not exists...</p>
	} else if (authStatus === "unauthenticated") {
		title = "Unauthenticated";
		content = <p className="text-center">You must be signed in to view this page...</p>
	} else if (post?.authorMail !== sessionData?.user?.email) {
		title = "Unauthenticated";
		content = <p className="text-center">You must be author of this post to edit it...</p>
	} else {
		title = post.title.slice(0, 20) + (post.title.length > 20 ? "..." : "");
		content = <>
			<div style={{ textAlign: "center" }}>
				<Link href={"/posts/" + post?.id}>
					<Button variant="outlined" startIcon={<ChevronLeft />}>
						Go Back To Post
					</Button>
				</Link>
			</div>

			<Paper className="main" style={{ padding: 20, margin: "48px auto" }} elevation={4}>
				<PostForm type="edit" post={post} />
			</Paper>
		</>
	}

	return (
		<>
			<Head>
				<title>{title} | Edit | Prisma Blog</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div style={{ marginTop: 32 }}>{content}</div>
		</>
	)
}