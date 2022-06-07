import Head from 'next/head'
import Header from '../components/Header';
import { Prisma } from '@prisma/client'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Home(props) {
	const { data } = useSession();
	const { user } = data || {};
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const router = useRouter();

	async function SubmitForm() {
		if (title.length < 5) {
			alert("Title must be at least 5 characters long.");
			return;
		} else if (content.length < 20) {
			alert("Content must be at least 20 characters long.");
			return;
		}

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

	return (
		<div>
			<Head>
				<title>Prisma Blog - Create Post</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<div>
				<input type="text" placeholder="Post Title..." onChange={e => setTitle(e.target.value)} required />
				<textarea placeholder="Post Content..." onChange={e => setContent(e.target.value)} required />
				<button type="button" onClick={SubmitForm}>Submit</button>
			</div>
		</div>
	)
}
