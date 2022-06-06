import Head from 'next/head'
import styles from '@/pages/index.module.css'
import { PrismaClient, Post, Prisma } from '@prisma/client'
import { useState } from 'react';

const prisma = new PrismaClient();

type PostFormData = {
  authorId: Number,
  title: String,
  content: String,
}

export async function getServerSideProps() {
  const posts: Post[] = await prisma.post.findMany();

  return {
    props: {
      posts
    }
  }
}

async function CreatePost(data: PostFormData) {
  const response = await fetch('/api/posts', {
    method: "POST",
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export default function Home(props: { posts: Post[] }) {
  const [posts, setPosts] = useState(props.posts);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const SubmitForm = async () => {
    const formData: PostFormData = { authorId: 1, title, content };

    try {
      const createdPost = await CreatePost(formData);
      setPosts([...posts, createdPost]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form>
        <input type="text" onChange={e => setTitle(e.target.value)} required />
        <input type="text" onChange={e => setContent(e.target.value)} required />
        <button type="button" onClick={SubmitForm}>Submit</button>
      </form>

      <div>
        {
          posts.map(post => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>
                {post.content}
              </p>
            </div>
          ))
        }
      </div>
    </div>
  )
}
