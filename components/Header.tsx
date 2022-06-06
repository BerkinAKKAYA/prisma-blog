import { useSession, signIn, signOut } from "next-auth/react"
import styles from './Header.module.scss';

export default function Component() {
	const { data } = useSession()
	const { user } = data || {};

	return (
		<>
			<a href="/">
				<h2 className={styles.heading}>Blog</h2>
			</a>

			<header className={styles.header}>
				{
					(user) ? <>
						<span>Signed in as <b>{user.name}</b></span>

						<div className={styles.buttons}>
							<a href="/my-posts"><button>My Posts</button></a>
							<a href="/create-post"><button>Create Post</button></a>
							<button onClick={() => signOut()}>Sign out</button>
						</div>
					</> : <>
						<span>Not signed in</span>
						<button onClick={() => signIn()}>Sign in</button>
					</>
				}
			</header>
		</>
	)
}