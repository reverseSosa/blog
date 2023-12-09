import Link from "next/link";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { Newspaper } from "lucide-react";

import UserMenu from "@/components/ui/header/UserMenu";
import ThemeSwitcher from "@/components/ui/header/ThemeSwitcher";

import { authOptions } from "@/lib/authOptions";

const getRole = async (email: string): Promise<"ADMIN" | "USER"> => {
	const user = await prismadb.user.findUnique({
		where: { email },
	});

	return user?.role === "ADMIN" ? "ADMIN" : "USER";
};

const Header = async () => {
	const session = await getServerSession(authOptions);

	const role = session ? await getRole(session.user?.email!) : "USER";

	return (
		<header className="w-full border-b border-border bg-background/60 backdrop-blur fixed top-0 left-0">
			<div className="flex items-center justify-between w-full max-w-screen-xl mx-auto py-2 max-xl:px-4">
				<Link href="/" className="flex items-center gap-2">
					<Newspaper className="w-4 h-4" />
					<span className="font-semibold text-base">blog</span>
				</Link>

				<div className="flex items-center gap-2">
					<UserMenu session={session} role={role} />
					<ThemeSwitcher />
				</div>
			</div>
		</header>
	);
};

export default Header;
