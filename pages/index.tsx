import Head from 'next/head'
import { styled } from '@mui/material/styles';
import { PrismaClient, Post } from '@prisma/client'
import Header from '../components/Header';
import { useSession } from 'next-auth/react';

const prisma = new PrismaClient();

const Welcome = styled('p')(({ theme }) => ({
  textAlign: "center",
  fontSize: "1.6em",
  margin: "48px 0",
}));

export async function getServerSideProps() {
  const posts: Post[] = await prisma.post.findMany();
  return { props: { posts } }
}

export default function Home(props: { posts: Post[] }) {
  const { posts } = props;
  const user = useSession()?.data?.user || null;

  return (
    <div>
      <Head>
        <title>Prisma Blog by Berkin AKKAYA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {user ? <Welcome>{`Welcome back, ${user.name}!`}</Welcome> : ''}

      <div>
        {
          posts.length === 0
            ? <p style={{ textAlign: "center" }}>Nobody posted anything. Yet...</p>
            : posts.map(post => (
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
