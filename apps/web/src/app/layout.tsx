import type { Metadata } from "next";

import { DM_Sans, JetBrains_Mono } from "next/font/google";

import "@/index.css";
import Providers from "@/components/providers";

const dmSans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "chrono",
	description: "chrono",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
			>
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">{children}</div>
				</Providers>
			</body>
		</html>
	);
}
