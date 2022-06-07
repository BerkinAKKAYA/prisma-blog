import { InferGetServerSidePropsType } from "next";
import { Post as PostType, PrismaClient } from "@prisma/client";
import { Button, Paper } from "@mui/material";
import { ChevronLeft, Edit as EditIcon } from "@mui/icons-material";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

const prisma = new PrismaClient();

export async function getServerSideProps(context: { params: { id: number } }) {
	const idParams = context.params.id;
	const id = Array.isArray(idParams) ? parseInt(idParams[0]) : 0;

	let post: (PostType | null) = null;

	if (!isNaN(id)) {
		post = await prisma.post.findUnique({ where: { id } })
	}

	return { props: { post: post ? JSON.stringify(post) : null } }
}

export default function (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const post: (PostType | null) = props.post ? JSON.parse(props.post) : null;
	const user = useSession()?.data?.user || null;

	return (
		<>
			<Head>
				<title>{post ? post.title.slice(0, 20) : 'Not Found'} | Prisma Blog</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{
				post ?
					<>
						<div style={{ textAlign: 'center', margin: "48px 0 24px 0" }}>
							<h3 style={{ fontSize: "1.6em" }}>{post.title}</h3>
							<small style={{ opacity: .5 }}>
								by <b>{post.authorName}</b>
							</small>
						</div>

						{
							post.authorMail === user?.email ? (
								<div style={{ textAlign: "center", marginBottom: 32 }}>
									<Link href={"/posts/edit/" + post.id}>
										<Button variant="outlined" endIcon={<EditIcon />}>
											Edit
										</Button>
									</Link>
								</div>
							) : ""
						}

						<Paper className="main" style={{ padding: 20 }} elevation={4}>
							<p style={{ textAlign: "justify", textIndent: "1em", fontSize: "0.96rem", lineHeight: "1.8em" }}>
								{post.content}
							</p>
						</Paper>
					</>
					:
					<>
						<div style={{ textAlign: 'center', margin: "48px 0 24px 0" }}><h3 style={{ fontSize: "1.6em" }}>Not Found</h3></div>
						<p style={{ fontSize: "0.96rem", textAlign: "center" }}>Post Not Found...</p>
						<div style={{ textAlign: "center", marginTop: 24 }}>
							<Link href="/">
								<Button variant="outlined" startIcon={<ChevronLeft />}>
									Go Back To Home
								</Button>
							</Link>
						</div>
					</>
			}
		</>
	)
}