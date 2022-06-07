import { Check } from "@mui/icons-material";
import { Button, Stack, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { Post as PostType, Prisma } from "@prisma/client";

interface PostForm {
	type: string,
	post_id?: number
}

const minLengths = {
	title: 5,
	content: 20,
}

const ruleErrors = {
	titleError: `Title must be at least ${minLengths.title} characters long.`,
	contentError: `Content must be at least ${minLengths.content} characters long.`
}

enum InputType { "Title", "Content" }

function PostForm(props: { type: string, post?: PostType }) {
	const user = useSession()?.data?.user || null;
	const router = useRouter();

	const [title, setTitle] = useState(props?.post?.title || "");
	const [titleError, setTitleError] = useState("");
	const [content, setContent] = useState(props?.post?.content || "");
	const [contentError, setContentError] = useState("");

	const CreateNewPost = async () => {
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
			authorName: user?.name || "",
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

	const UpdateExistingPost = async () => {
		if (!props?.post) {
			console.log("Post does not exists.");
			return;
		}

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

		const data: Prisma.PostUpdateInput = { title, content };

		try {
			const response = await fetch('/api/posts', { method: "PATCH", body: JSON.stringify({ id: props.post.id, data }) });
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
		<Stack spacing={2}>
			<TextField
				label="Post Title"
				variant="outlined"
				onChange={el => OnInputChange(el, InputType.Title)}
				error={!!titleError}
				helperText={titleError}
				value={title}
				fullWidth
			/>

			<TextField
				label="Post Content"
				multiline
				rows={8}
				variant="outlined"
				onChange={el => OnInputChange(el, InputType.Content)}
				error={!!contentError}
				helperText={contentError}
				value={content}
				fullWidth
			/>

			{
				props.type === "create" ? (
					<Button variant="contained" endIcon={<Check />} onClick={CreateNewPost} color="success">
						Publish
					</Button>
				) : (
					<Button variant="contained" endIcon={<Check />} onClick={UpdateExistingPost} color="success">
						Save
					</Button>
				)
			}
		</Stack>
	)
}

export default PostForm;