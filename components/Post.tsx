import { Post as PostType } from '@prisma/client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Card, CardActions, CardContent, Button, Typography } from '@mui/material';
import { ArrowRight, ChevronRight } from '@mui/icons-material';

interface Props {
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
				<a href={'/posts/detail/' + props.postInfo.id}>
					<Button variant="outlined" endIcon={<ChevronRight />} >Read More</Button>
				</a>

				{
					canEdit && (
						<a href={'/posts/edit/' + props.postInfo.id}>
							<Button size="small">Edit</Button>
						</a>
					)
				}
			</CardActions>
		</Card>
	)
}