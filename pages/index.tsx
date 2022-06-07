import Head from 'next/head'
import { PrismaClient, Post as PostType } from '@prisma/client'
import { useSession } from 'next-auth/react';
import Post from '@/components/Post';
import { InferGetServerSidePropsType } from "next";
import { Paper, Stack } from '@mui/material';
import { Key } from 'react';
import PageHeader from '@/components/PageHeader';

const prisma = new PrismaClient();

export async function getServerSideProps() {
  let posts: PostType[] = await prisma.post.findMany({ orderBy: { updatedAt: 'desc' } });
  return { props: { posts: JSON.stringify(posts) } }
}

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const posts = JSON.parse(props.posts);
  const user = useSession()?.data?.user || null;

  return (
    <div>
      <Head>
        <title>Prisma Blog by Berkin AKKAYA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {
        user
          ? <PageHeader>{`Welcome back, ${user.name}!`}</PageHeader>
          : <PageHeader>Welcome to Prisma Blog!</PageHeader>
      }

      <main className="main">
        <Stack spacing={3} className="post-holder">
          {
            posts.length === 0
              ? <p style={{ textAlign: "center" }}>Nobody posted anything. Yet...</p>
              : posts.map((post: PostType, i: Key) => (
                <Post postInfo={post} key={i} />
              ))
          }
        </Stack>
      </main>
    </div>
  )
}
