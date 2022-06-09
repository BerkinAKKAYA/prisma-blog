import Head from 'next/head'
import Post from '@/components/Post';
import PageHeader from '@/components/PageHeader';
import { Key } from 'react';
import { InferGetServerSidePropsType } from "next";
import { PrismaClient, Post as PostType } from '@prisma/client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Pagination, Stack } from '@mui/material';

const prisma = new PrismaClient();
const pageLength = 3;

export async function getServerSideProps(context: { query?: { page?: string } }) {
  let page = context?.query?.page ? parseInt(context.query.page) : 1;
  page = Math.max(page, 1); // page can't be less than 1

  const posts: PostType[] = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    skip: pageLength * (page - 1),
    take: pageLength,
  });

  const postCount: number = await prisma.post.count();

  return {
    props: {
      posts: JSON.stringify(posts),
      postCount,
    }
  }
}

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const posts = JSON.parse(props.posts);
  const pageCount = Math.ceil(props.postCount / pageLength);
  const user = useSession()?.data?.user || null;
  const router = useRouter();
  const page = router?.query?.page ? parseInt(router.query.page.toString()) : 1;

  console.log(page);

  const OnPageChange = (value: number) => {
    router.push({ query: { page: value } })
  }

  const PaginationComponent = () => {
    return <Pagination
      count={pageCount}
      onChange={(_, value: number) => OnPageChange(value)}
      defaultPage={page}
      defaultValue={page}
      style={{ margin: "24px 0", display: "flex", justifyContent: "center" }}
    />
  }

  return (
    <div>
      <Head>
        <title>Prisma Blog by Berkin AKKAYA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {
        page > 1
          ? <PaginationComponent />
          : user
            ? <PageHeader>{`Welcome back, ${user.name}!`}</PageHeader>
            : <PageHeader>Welcome to Prisma Blog!</PageHeader>
      }

      <main className="main">
        <Stack spacing={3} className="post-holder">
          {
            pageCount === 0 // if there is no pages...
              ? <p className="text-center">Nobody posted anything. Yet...</p>
              : posts.length === 0 // if page is empty...
                ? <p className="text-center">This page does not exists...</p>
                : posts.map((post: PostType, i: Key) => <Post postInfo={post} key={i} />)
          }
        </Stack>

        <PaginationComponent />
      </main>
    </div>
  )
}