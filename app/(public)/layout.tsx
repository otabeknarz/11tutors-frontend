export default function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <section className="mt-24 sm:mt-28">{children}</section>;
}
