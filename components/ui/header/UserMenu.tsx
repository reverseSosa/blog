"use client";

import Link from "next/link";
import { Session } from "next-auth";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { LogIn, LogOut, Moon, Sun, User } from "lucide-react";

import { cn } from "@/lib/utils";

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMenuProps {
	session: Session | null;
	role: "ADMIN" | "USER";
}

const UserMenu: React.FC<UserMenuProps> = ({ session, role }) => {
	const { theme, setTheme } = useTheme();

	const content =
		role === "ADMIN"
			? [
					{
						title: "Админ панель",
						href: "/admin",
						icon: <User className="w-4 h-4" />,
					},
			  ]
			: [];

	if (!session) {
		return (
			<Link
				href="/login"
				className={buttonVariants({ variant: "ghost", size: "icon" })}
			>
				<LogIn className="w-[1.2rem] h-[1.2rem]" />
			</Link>
		);
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="hidden xl:block">
					<Avatar className="w-8 h-8">
						<AvatarImage src={session?.user?.image || undefined} />
						<AvatarFallback>
							{session?.user?.email?.substring(0, 1).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{content.map((item, index) => (
						<DropdownMenuItem asChild key={index}>
							<Link
								href={item.href}
								className="flex items-center cursor-pointer"
							>
								<div className="h-6 w-6 mr-2 flex items-center justify-center">
									{item.icon}
								</div>
								{item.title}
							</Link>
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => signOut()}
						className="cursor-pointer"
					>
						<div className="h-6 w-6 mr-2 flex items-center justify-center">
							<LogOut className="w-4 h-4" />
						</div>
						Выйти
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Sheet>
				<SheetTrigger className="xl:hidden">
					<Avatar className="w-8 h-8">
						<AvatarImage src={session?.user?.image || undefined} />
						<AvatarFallback>
							{session?.user?.email?.substring(0, 1).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</SheetTrigger>
				<SheetContent className="w-full sm:w-[420px] border-none sm:border-solid p-0">
					<SheetHeader>
						<SheetTitle className="pb-4 pt-16 text-start px-4">
							{session?.user?.email}
						</SheetTitle>
						<SheetDescription>
							{content.map((item, index) => (
								<SheetClose key={index} asChild>
									<Link
										href={item.href}
										className={cn(
											buttonVariants({ variant: "ghost" }),
											"p-4 w-full text-base font-normal text-primary justify-start h-14",
										)}
									>
										<div className="h-6 w-6 mr-2 flex items-center justify-center">
											{item.icon}
										</div>

										{item.title}
									</Link>
								</SheetClose>
							))}
							<div className="border-t">
								<div
									className="w-full p-4 items-center text-base text-primary flex justify-between"
									onClick={() => {
										theme === "light" ? setTheme("dark") : setTheme("light");
									}}
								>
									<div className="h-6 w-6 mr-2 flex items-center justify-center">
										<Sun className="w-4 h-4 dark:hidden" />
										<Moon className="w-4 h-4 hidden dark:block" />
									</div>
									<p className="mr-auto">Тема</p>
									<Switch checked={theme === "dark"} />
								</div>
								<Button
									onClick={() => signOut()}
									variant="ghost"
									className="w-full text-base font-normal text-primary justify-start p-4 h-14"
								>
									<div className="h-6 w-6 mr-2 flex items-center justify-center">
										<LogOut className="w-4 h-4" />
									</div>
									Выйти
								</Button>
							</div>
						</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</>
	);
};

export default UserMenu;
