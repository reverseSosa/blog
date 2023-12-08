"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

const ThemeSwitcher = () => {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			variant="ghost"
			size="icon"
			className="max-lg:hidden"
			onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
		>
			<Sun className="w-[1.2rem] h-[1.2rem] scale-100 dark:scale-0" />
			<Moon className="absolute w-[1.2rem] h-[1.2rem] scale-0 dark:scale-100" />
		</Button>
	);
};

export default ThemeSwitcher;
