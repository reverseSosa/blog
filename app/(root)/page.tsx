import { revalidatePath } from "next/cache";

import prismadb from "@/lib/prismadb";

import PostCard from "./components/PostCard";
import Pagination from "./components/Pagination";

export const metadata = {
	title: "Главная страница - blog",
};

export type FetchPostsReturn = typeof fetchPosts;

const PAGE_SIZE = 8;

const fetchPosts = async ({ take = PAGE_SIZE, skip = 0 }) => {
	"use server";

	const results = await prismadb.post.findMany({
		take,
		skip,
		orderBy: {
			createdAt: "desc",
		},
		include: {
			_count: {
				select: {
					comments: true,
					likes: true,
				},
			},
			user: {
				select: {
					name: true,
				},
			},
			comments: {
				orderBy: {
					createdAt: "desc",
				},
				take: 1,
				select: {
					username: true,
					createdAt: true,
				},
			},
		},
	});

	const total = await prismadb.post.count();

	revalidatePath("/");

	return {
		data: results,
		metadata: {
			hasNextPage: skip + take < total,
			totalPages: Math.ceil(total / take),
		},
	};
};

export type HomeProps = {
	params: { [key: string]: string | string[] | undefined };
	searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Home(props: HomeProps) {
	const pageNumber = Number(props?.searchParams?.page || 1);

	const take = PAGE_SIZE;

	const skip = (pageNumber - 1) * take;

	const { data, metadata } = await fetchPosts({ take, skip });

	return (
		<main className="flex min-h-screen flex-col items-center justify-between pt-20 pb-10">
			<div className="flex flex-col gap-4 max-w-screen-xl w-full px-4">
				{data.map((post) => (
					<PostCard
						key={post.id}
						post={{
							...post,
							comments: post._count.comments,
							likes: post._count.likes,
							name: post.user.name!,
							lastCommentDate: post.comments[0]?.createdAt ?? null,
							lastUserName: post.comments[0]?.username ?? null,
						}}
					/>
				))}
				{data.length === 0 && (
					<p className="text-muted-foreground self-stretch text-center">
						Пока что нет статей :(
					</p>
				)}
				{data.length > 0 && (
					<Pagination {...props.searchParams} {...metadata} />
				)}
			</div>
		</main>
	);
}
