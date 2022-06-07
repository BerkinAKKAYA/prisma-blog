import Head from 'next/head'
import Header from '../components/Header';
import { Prisma } from '@prisma/client'
import { ChangeEvent, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button, Paper, Stack, TextField } from '@mui/material';
import { Check } from '@mui/icons-material';
import PageHeader from '@/components/PageHeader';

const minLengths = {
	title: 5,
	content: 20,
}
const ruleErrors = {
	titleError: `Title must be at least ${minLengths.title} characters long.`,
	contentError: `Content must be at least ${minLengths.content} characters long.`
}

enum InputType { "Title", "Content" }

export default function Home(props) {
	const { data } = useSession();
	const { user } = data || {};
	const [title, setTitle] = useState("");
	const [titleError, setTitleError] = useState("");
	const [content, setContent] = useState("");
	const [contentError, setContentError] = useState("");
	const router = useRouter();

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

		const formData: Prisma.PostCreateInput = {
			authorMail: user?.email || "",
			title,
			content
		};

		try {
			const response = await fetch('/api/posts', { method: "POST", body: JSON.stringify(formData) });
			const createdPost = await response.json();

			if (response.ok && createdPost.id) {
				alert("Post created!");
				router.push("/my-posts");
				setTitle("");
				setContent("");
			}
		} catch (err) {
			console.log(err);
			alert("An error occurred!");
		}
	}

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

	return (
		<div>
			<Head>
				<title>Prisma Blog - Create Post</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<Paper style={{ maxWidth: "600px", margin: "50px auto", padding: 20, paddingTop: 1 }} elevation={4}>
				<PageHeader shrink>Create Post</PageHeader>

				<Stack spacing={2}>
					<TextField
						label="Post Title"
						variant="outlined"
						onChange={el => OnInputChange(el, InputType.Title)}
						error={!!titleError}
						helperText={titleError}
						fullWidth
					/>

					<TextField
						label="Post Content"
						multiline
						rows={4}
						variant="outlined"
						onChange={el => OnInputChange(el, InputType.Content)}
						error={!!contentError}
						helperText={contentError}
						fullWidth
					/>

					<Button variant="contained" endIcon={<Check />} onClick={SubmitForm} color="success">
						Publish
					</Button>
				</Stack>
			</Paper>
		</div>
	)
}
