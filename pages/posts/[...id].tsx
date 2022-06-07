import { InferGetServerSidePropsType } from "next";
import { Post as PostType, PrismaClient } from "@prisma/client";
import Head from "next/head";
import Header from "@/components/Header";
import PageHeader from '@/components/PageHeader';
import { Paper } from "@mui/material";

const prisma = new PrismaClient();

export async function getServerSideProps(context: { params: { id: number } }) {
	const idParams = context.params.id;
	const id = Array.isArray(idParams) ? parseInt(idParams[0]) : 0;
	let post: (PostType | null) = await prisma.post.findUnique({ where: { id } })
	return { props: { post: JSON.stringify(post) } }
}

export default function (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const post: PostType = JSON.parse(props.post);

	return (
		<>
			<Head>
				<title>{post.title.slice(0, 20)} | Prisma Blog</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<div style={{ textAlign: 'center', margin: "48px 0 24px 0" }}>
				<h3 style={{ fontSize: "1.6em" }}>{post.title}</h3>
				<small style={{ opacity: .5 }}>
					by <b>{post.authorName}</b>
				</small>
			</div>

			<Paper className="main" style={{ padding: 20 }} elevation={4}>
				<p style={{ textAlign: "justify", textIndent: "1em", fontSize: "0.96rem", lineHeight: "1.8em" }}>
					{post.content}
				</p>
			</Paper>
		</>
	)
}