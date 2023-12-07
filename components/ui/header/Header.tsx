import Link from "next/link";
import { getServerSession } from "next-auth";
import { LogIn, Newspaper } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import ThemeSwitcher from "@/components/ui/header/ThemeSwitcher";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Header = async () => {
	const session = await getServerSession(authOptions);

	return (
		<header className="w-full border-b border-border bg-background backdrop-blur-md fixed top-0 left-0">
			<div className="flex items-center justify-between w-full max-w-screen-xl mx-auto py-2 max-xl:px-4">
				<Link href="/" className="flex items-center gap-2">
					<Newspaper className="w-4 h-4" />
					<span className="font-semibold text-base">blog</span>
				</Link>
				<div className="flex items-center gap-2">
					{session ? (
						<Avatar className="w-8 h-8">
							<AvatarFallback>
								{session.user?.email?.toString()[0].toUpperCase()}
							</AvatarFallback>
							<AvatarImage src={session.user?.image!} />
						</Avatar>
					) : (
						<Link
							href="/login"
							className={buttonVariants({ variant: "ghost", size: "icon" })}
						>
							<LogIn className="w-[1.2rem] h-[1.2rem]" />
						</Link>
					)}

					<ThemeSwitcher />
				</div>
			</div>
		</header>
	);
};

export default Header;
