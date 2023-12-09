import { ru } from "date-fns/locale";
import { getServerSession } from "next-auth";
import { MessageSquare } from "lucide-react";
import { format, formatDistanceToNow, isToday } from "date-fns";

import prismadb from "@/lib/prismadb";

import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import CommentForm from "./components/CommentForm";
import CommentCard from "./components/CommentCard";
import LikeButton from "./components/LikeButton";

export async function generateMetadata({
	params: { postId },
}: { params: { postId: string } }) {
	const post = await prismadb.post.findUnique({
		where: {
			id: postId,
		},
	});

	return {
		title: `BLOG - ${post?.title}`,
	};
}

const getAccount = async (email: string, postId: string) => {
	try {
		const user = await prismadb.user.findUnique({
			where: { email },
			include: {
				likes: {
					where: { postId },
				},
			},
		});

		return user;
	} catch (error) {
		process.env.NEXT_PUBLIC_DEBUG && console.log("No user found");

		return null;
	}
};

const PostPage = async ({
	params: { postId },
}: { params: { postId: string } }) => {
	const session = await getServerSession(authOptions);

	const user = await getAccount(session?.user?.email!, postId);

	const liked = user?.likes[0] ? true : false;

	const post = await prismadb.post.findUnique({
		where: { id: postId },
		include: {
			_count: {
				select: {
					likes: true,
					comments: true,
				},
			},
			comments: {
				include: {
					user: {
						select: { name: true },
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	if (!post) {
		return (
			<main className="min-h-screen flex flex-col pt-20">
				<div className="w-full max-w-screen-xl mx-auto px-4 flex justify-center">
					<p>Такой статьи не существует</p>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen flex flex-col pt-20 pb-10">
			<div className="w-full max-w-screen-xl mx-auto px-4 flex flex-col gap-4">
				<div className="flex items-end justify-between">
					<Heading title={post?.title!} description={post.description ?? ""} />
					<div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
						<span className="whitespace-nowrap">
							{isToday(post.createdAt)
								? `${formatDistanceToNow(post.createdAt, { locale: ru })} назад`
								: format(post.createdAt, "dd MMMM yyyy", { locale: ru })}
						</span>
					</div>
				</div>
				<Separator />
				{post.content.split("\n\n").map((p) => (
					<p>{p}</p>
				))}
				<Separator />
				<div className="flex items-center space-x-4">
					<LikeButton
						liked={liked}
						likes={post._count.likes}
						userId={user?.id!}
						postId={postId}
					/>
					<div className="flex items-center">
						<MessageSquare className="mr-2 stroke-1" /> {post._count.comments}
					</div>
				</div>

				{session ? (
					<CommentForm />
				) : (
					<p className="text-muted-foreground text-sm">
						Войдите чтобы оставить комментарий
					</p>
				)}
				{post.comments.map((comment) => (
					<CommentCard
						key={comment.id}
						username={comment.user.name!}
						createdAt={comment.createdAt}
						content={comment.content}
					/>
				))}
			</div>
		</main>
	);
};

export default PostPage;
