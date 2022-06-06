import Head from 'next/head'
import styles from '@/pages/index.module.css'
import { PrismaClient, Post } from '@prisma/client'
import { useState } from 'react';
import Header from '../components/Header';

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

export default function Home(props: { posts: Post[] }) {
  const [posts, setPosts] = useState(props.posts);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const SubmitForm = async () => {
    const formData: PostFormData = { authorId: 1, title, content };

    try {
      const response = await fetch('/api/posts', { method: "POST", body: JSON.stringify(formData) });
      const createdPost = await response.json();
      setPosts([...posts, createdPost]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.log(err);
      alert("An error occurred!");
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <form>
        <input type="text" placeholder="Post Title..." onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Post Content..." onChange={e => setContent(e.target.value)} required />
        <button type="button" onClick={SubmitForm}>Submit</button>
      </form>

      <div>
        {
          posts.map(post => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}
