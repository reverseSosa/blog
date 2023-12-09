import prismadb from "@/lib/prismadb";

import PostForm from "./components/PostForm";

export async function generateMetadata({
	params: { postId },
}: { params: { postId: string } }) {
	const post = await prismadb.post.findUnique({
		where: {
			id: postId,
		},
	});

	if (!post) {
		return {
			title: `Создать статью - blog`,
		};
	}

	return {
		title: `Редактировать - ${post?.title}`,
	};
}

const PostPage = async ({
	params: { postId },
}: { params: { postId: string } }) => {
	const post = await prismadb.post.findUnique({
		where: {
			id: postId,
		},
	});

	return (
		<main className="min-h-screen flex flex-col pt-20 pb-10">
			<div className="w-full max-w-screen-xl mx-auto px-4 space-y-4 max">
				<PostForm initialData={post} />
			</div>
		</main>
	);
};

export default PostPage;
