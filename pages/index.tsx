import Head from 'next/head'
import { PrismaClient, Post } from '@prisma/client'
import Header from '../components/Header';

const prisma = new PrismaClient();

export async function getServerSideProps() {
  const posts: Post[] = await prisma.post.findMany();
  return { props: { posts } }
}

export default function Home(props: { posts: Post[] }) {
  const { posts } = props;

  return (
    <div>
      <Head>
        <title>Prisma Blog by Berkin AKKAYA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

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
