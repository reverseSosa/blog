"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { Post } from "@prisma/client";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import AlertModal from "@/components/ui/modals/AlertModal";

const formSchema = z.object({
	title: z.string().min(1),
	content: z.string().max(2400, "Не более 2400 символов"),
	description: z.string().max(100).optional(),
});

interface PostFormProps {
	initialData: Post | null;
}

type PostFormValues = z.infer<typeof formSchema>;

const PostForm: React.FC<PostFormProps> = ({ initialData }) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const params = useParams();
	const router = useRouter();

	const title = initialData ? "Редактировать статью" : "Создать статью";
	const description = initialData
		? "Страница редактирования статьи"
		: "Страница добавления статьи";
	const toastMessage = initialData ? "Статья обновлена" : "Статья создана";
	const action = initialData ? "Сохранить изменения" : "Создать";

	const form = useForm<PostFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
			? {
					...initialData,
					description: initialData.description ?? "",
			  }
			: {
					title: "",
					content: "",
					description: "",
			  },
	});

	const onSubmit = async (data: PostFormValues) => {
		try {
			setLoading(true);

			if (initialData) {
				await axios.patch(`/api/posts/${params.postId}`, data);
			} else {
				await axios.post(`/api/posts`, data);
			}

			router.push(`/admin`);
			router.refresh();
			toast.success(toastMessage);
		} catch (error) {
			toast.error("Что-то пошло не так");
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/posts/${params.postId}`);

			router.push(`/admin`);
			router.refresh();
			toast.success("Статья удалена");
		} catch (error) {
			toast.error("Что-то пошло не так");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<AlertModal
				open={open}
				onClose={() => setOpen(false)}
				onSubmit={onDelete}
				title="Удалить статью"
				description="Это действие нельзя отменить"
				action="Удалить"
			/>
			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						onClick={() => setOpen(true)}
						disabled={loading}
						variant="destructive"
						size="icon"
					>
						<Trash className="h-4 w-4" />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<FormField
							name="title"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Заголовок</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Заголовок"
											disabled={loading}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="description"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Описание</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Описание"
											disabled={loading}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="content"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Текст</FormLabel>
									<FormControl>
										<Textarea
											className="min-h-[300px] md:min-h-[400px] h-fit"
											placeholder="Текст"
											disabled={loading}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button variant="default" type="submit" className="">
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};

export default PostForm;
