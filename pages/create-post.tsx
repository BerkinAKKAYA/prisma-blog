import Head from 'next/head'
import Header from '../components/Header';
import { Prisma } from '@prisma/client'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Home() {
	const { data } = useSession();
	const { user } = data || {};
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const router = useRouter();

	let pageContent = (
		<form>
			<input type="text" placeholder="Post Title..." onChange={e => setTitle(e.target.value)} required />
			<textarea placeholder="Post Content..." onChange={e => setContent(e.target.value)} required />
			<button type="button" onClick={SubmitForm}>Submit</button>
		</form>
	)

	if (!user) {
		pageContent = <p style={{ textAlign: "center" }}>Please sign in to create posts.</p>;
	} else if (!user.email) {
		pageContent = <p style={{ textAlign: "center" }}>Couldn't access your email, please sign in with another option.</p>;
	}

	async function SubmitForm() {
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
				<title>Blog</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			{pageContent}
		</div>
	)
}
