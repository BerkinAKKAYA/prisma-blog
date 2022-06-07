import Head from 'next/head'
import Header from '../components/Header';
import PageHeader from '@/components/PageHeader';
import { Paper } from '@mui/material';
import PostForm from '@/components/PostForm';

export default function Home(props) {
	return (
		<div>
			<Head>
				<title>Prisma Blog - Create Post</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<Paper className="main" style={{ padding: 20, paddingTop: 1, margin: "48px auto" }} elevation={4}>
				<PageHeader>Create Post</PageHeader>
				<PostForm type="create" />
			</Paper>
		</div>
	)
}
