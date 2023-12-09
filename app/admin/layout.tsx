import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import prismadb from "@/lib/prismadb";

import { authOptions } from "@/lib/authOptions";

export default async function AdminLayout({
	children,
}: { children: React.ReactNode }) {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/login");
	}

	try {
		const user = await prismadb.user.findUnique({
			where: {
				email: session.user?.email!,
			},
		});

		const isAdmin = user?.role === "ADMIN";

		if (!isAdmin) {
			redirect("/login");
		}
	} catch (error) {
		console.log("User doesnt exists");
		redirect("/login");
	}

	return <>{children}</>;
}
