import { InferGetServerSidePropsType } from "next";
import { Post as PostType, Prisma, PrismaClient } from "@prisma/client";
import Head from "next/head";
import Header from "@/components/Header";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { Check, ChevronLeft } from "@mui/icons-material";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const prisma = new PrismaClient();

const minLengths = {
	title: 5,
	content: 20,
}
const ruleErrors = {
	titleError: `Title must be at least ${minLengths.title} characters long.`,
	contentError: `Content must be at least ${minLengths.content} characters long.`
}
enum InputType { "Title", "Content" }

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

	const [title, setTitle] = useState(post?.title || "");
	const [titleError, setTitleError] = useState("");
	const [content, setContent] = useState(post?.content || "");
	const [contentError, setContentError] = useState("");

	const router = useRouter();

	const OnInputChange = (event: ChangeEvent, inputType: InputType) => {
		const val = (event?.target as HTMLInputElement)?.value || "";

		switch (inputType) {
			case InputType.Title:
				setTitle(val)
				setTitleError((val.length > 0 && val.length < minLengths.title) ? ruleErrors.titleError : '');
				break;

			case InputType.Content:
				setContent(val)
				setContentError((val.length > 0 && val.length < minLengths.content) ? ruleErrors.contentError : '');
				break;
		}
	}

	async function SubmitForm() {
		let error = false;

		if (title.length < minLengths.title) {
			error = true;
			setTitleError(ruleErrors.titleError)
		} else {
			setTitleError("")
		}

		if (content.length < minLengths.content) {
			error = true;
			setContentError(ruleErrors.contentError)
		} else {
			setContentError("")
		}

		if (error) { return; }

		const formData: Prisma.PostUpdateInput = { title, content };

		try {
			const body = {
				id: post?.id,
				data: formData
			};
			const response = await fetch('/api/posts', { method: "PATCH", body: JSON.stringify(body) });
			const updatedPost: PostType = await response.json();

			if (response.ok && updatedPost.id) {
				alert("Post updated!");
				router.push("/posts/" + updatedPost.id);
				setTitle("");
				setContent("");
			}
		} catch (err) {
			console.log(err);
			alert("An error occurred!");
		}
	}

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
				post ?
					<Paper className="main" style={{ padding: 20, margin: "48px auto" }} elevation={4}>
						<Stack spacing={2}>
							<TextField
								label="Post Title"
								variant="outlined"
								onChange={el => OnInputChange(el, InputType.Title)}
								value={title}
								error={!!titleError}
								helperText={titleError}
								fullWidth
							/>

							<TextField
								label="Post Content"
								multiline
								rows={8}
								variant="outlined"
								onChange={el => OnInputChange(el, InputType.Content)}
								value={content}
								error={!!contentError}
								helperText={contentError}
								fullWidth
							/>

							<Button variant="contained" endIcon={<Check />} onClick={SubmitForm} color="success">
								Save
							</Button>
						</Stack>
					</Paper>
					:
					<p>not found</p>
			}
		</>
	)
}