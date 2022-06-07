export default function PageHeader(props: { children: string, shrink: boolean }) {
	const margin = props.shrink ? 24 : 48;

	return (
		<p style={{ textAlign: "center", fontSize: "1.6em", margin }}>
			{props.children}
		</p>
	)
}