import prismadb from "@/lib/prismadb";

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

const PostPage = async ({
	params: { postId },
}: { params: { postId: string } }) => {
	const post = await prismadb.post.findUnique({
		where: { id: postId },
	});

	return (
		<main className="min-h-screen flex flex-col">
			<div className="w-full max-w-screen-xl mx-auto px-4 flex flex-col"></div>
		</main>
	);
};

export default PostPage;
