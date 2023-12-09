"use client";

import * as z from "zod";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";

const formSchema = z.object({
	username: z.string().min(4, "От 4 символов").max(12, "Не более 12 символов"),
	email: z.string().email("Это не похоже на email"),
	password: z.string().min(6, "От 6 символов").max(20, "Не более 20 символов"),
});

type RegisterFormValues = z.infer<typeof formSchema>;

const RegisterForm = () => {
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: RegisterFormValues) => {
		try {
			setLoading(true);

			const res = await axios
				.post("/api/register", data)
				.then((response) => response.data);

			toast.success("Аккаунт создан");

			await signIn("credentials", { ...data, redirect: false });

			window.location.reload();

			process.env.NEXT_PUBLIC_DEBUG === "true" &&
				console.log("Register response", res);
		} catch (error) {
			toast.error("Ошибка при создании аккаунта");

			process.env.NEXT_PUBLIC_DEBUG === "true" &&
				console.log("Register error", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-2"
			>
				<FormField
					name="username"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Никнейм</FormLabel>
							<FormControl>
								<Input
									type="text"
									maxLength={12}
									autoComplete="username"
									placeholder="username"
									disabled={loading}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="email"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Почта</FormLabel>
							<FormControl>
								<Input
									type="email"
									autoComplete="email"
									placeholder="example@gmail.com"
									disabled={loading}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="password"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Пароль</FormLabel>
							<FormControl>
								<Input
									type="password"
									maxLength={20}
									autoComplete="new-password"
									placeholder="password"
									disabled={loading}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex flex-col gap-3">
					<Button type="submit" variant="default" className="mt-4">
						{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{" "}
						Создать аккаунт
					</Button>
					<div className="flex items-center gap-2">
						<div className="flex-1 bg-border h-[1px]" />
						<p className="text-sm text-muted-foreground">или</p>
						<div className="flex-1 bg-border h-[1px]" />
					</div>
					<Link
						href="/login"
						className={buttonVariants({ variant: "secondary" })}
					>
						Войти
					</Link>
				</div>
			</form>
		</Form>
	);
};

export default RegisterForm;
