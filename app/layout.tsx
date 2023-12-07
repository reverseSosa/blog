import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/ui/header/Header";

import ToastProvider from "@/provider/ToastProvider";
import { ThemeProvider } from "@/provider/ThemeProvider";

import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Blog",
	description: "Blog",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.className}>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					disableTransitionOnChange
				>
					<ToastProvider />
					<Header />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
