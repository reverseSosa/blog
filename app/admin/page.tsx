import Link from "next/link";
import { Plus } from "lucide-react";

import prismadb from "@/lib/prismadb";

import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/DataTable";
import { buttonVariants } from "@/components/ui/button";

import { Post, columns } from "./components/columns";

export const metadata = {
	title: "blog - Админ панель",
};

const AdminPage = async () => {
	const posts = await prismadb.post.findMany({
		include: {
			_count: {
				select: {
					comments: true,
					likes: true,
				},
			},
		},
	});

	const postsFormatted: Post[] = posts.map((post) => ({
		...post,
		comments: post._count.comments,
		likes: post._count.likes,
	}));

	return (
		<main className="min-h-screen flex flex-col pt-20 pb-10">
			<div className="flex flex-col w-full max-w-screen-xl px-4 mx-auto space-y-4">
				<div className="flex items-center justify-between">
					<Heading
						title={`Статьи (${posts.length})`}
						description="Здесь вы можете добавлять или редактировать статьи"
					/>
					<Link
						href="/admin/new"
						className={buttonVariants({ variant: "default" })}
					>
						<Plus className="w-4 h-4 lg:mr-2" />
						<span className="hidden lg:block">Создать статью</span>
					</Link>
				</div>
				<Separator />
				<DataTable data={postsFormatted} columns={columns} />
			</div>
		</main>
	);
};

export default AdminPage;
