import { Post as PostType } from '@prisma/client'
import { useSession } from 'next-auth/react';
import { Card, CardActions, CardContent, Button, Typography } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import Link from 'next/link';

interface Post {
	postInfo: PostType
}

export default function Post(props: { postInfo: PostType }) {
	const user = useSession()?.data?.user || null;
	const canEdit = props.postInfo.authorMail === user?.email;
	const wordsOfContent = props.postInfo.content.split(" ");

	return (
		<Card elevation={3}>
			<CardContent>
				<Typography gutterBottom variant="h5" component="div">
					{props.postInfo.title}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{
						wordsOfContent.slice(0, 20).join(" ")
						+ (wordsOfContent.length > 20 ? '...' : '')
					}
				</Typography>
			</CardContent>
			<CardActions>
				<Link href={'/posts/' + props.postInfo.id}>
					<Button variant="outlined" endIcon={<ChevronRight />} >Read More</Button>
				</Link>

				{
					canEdit && (
						<Link href={'/posts/edit/' + props.postInfo.id}>
							<Button size="small">Edit</Button>
						</Link>
					)
				}
			</CardActions>
		</Card>
	)
}