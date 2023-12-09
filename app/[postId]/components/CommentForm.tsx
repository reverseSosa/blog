"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
	content: z
		.string()
		.min(1, "Минимум 1 символ")
		.max(100, "Не больше 100 символов"),
});

type CommentFormValues = z.infer<typeof formSchema>;

const CommentForm = () => {
	const [loading, setLoading] = useState(false);

	const params = useParams();
	const router = useRouter();

	const form = useForm<CommentFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: "",
		},
	});

	const onSubmit = async (data: CommentFormValues) => {
		try {
			setLoading(true);
			const res = await axios
				.post("/api/comments", { ...data, postId: params.postId })
				.then((response) => response.data);

			process.env.NEXT_PUBLIC_DEBUG === "true" && console.log(res);

			toast.success("Комментарий добавлен");
			router.refresh();
		} catch (error) {
			toast.error("Ошибка");

			process.env.NEXT_PUBLIC_DEBUG === "true" && console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mt-2 flex items-end w-full space-x-2"
			>
				<FormField
					name="content"
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Оставить комментарий</FormLabel>
							<FormControl>
								<Input
									placeholder="Текст комментария"
									disabled={loading}
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type="submit" variant="outline">
					<Send className="w-4 h-4" />
				</Button>
			</form>
		</Form>
	);
};

export default CommentForm;
