"use server";

import { revalidatePath } from "next/cache";

import prismadb from "@/lib/prismadb";

export const like = async (userId: string, postId: string) => {
	if (!userId || !postId) {
		return null;
	}

	const exist = await prismadb.like.findFirst({ where: { postId, userId } });

	if (exist) {
		const like = await prismadb.like.deleteMany({ where: { postId, userId } });

		return like;
	}

	const like = await prismadb.like.create({
		data: {
			postId,
			userId,
		},
	});

	revalidatePath(`/${postId}`);

	return like;
};
