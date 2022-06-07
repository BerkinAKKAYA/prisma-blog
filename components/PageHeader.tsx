export default function PageHeader(props: { children: string }) {
	return (
		<p style={{ textAlign: "center", fontSize: "1.6em", margin: 30 }}>
			{props.children}
		</p>
	)
}