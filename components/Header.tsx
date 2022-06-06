import { useSession, signIn, signOut } from "next-auth/react"
import styles from './Header.module.scss';

export default function Component() {
	const { data } = useSession()
	const { user } = data || {};

	console.log(user);

	return (
		<header className={styles.header}>
			{
				(user) ? <>
					<span>Signed in as <b>{user.name}</b></span>
					<button onClick={() => signOut()}>Sign out</button>
				</> : <>
					<span>Not signed in</span>
					<button onClick={() => signIn()}>Sign in</button>
				</>
			}
		</header>
	)
}