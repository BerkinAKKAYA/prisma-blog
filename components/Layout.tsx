import { useSession } from "next-auth/react";
import Footer from "./Footer";
import Header from "./Header";

export default function (props: { children: any; }) {
	const { status } = useSession();

	if (status === 'loading') {
		return <h1 className="loading">Loading...</h1>
	}

	return <>
		<Header />

		{props.children}

		<Footer />
	</>
}