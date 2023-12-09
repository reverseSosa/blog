import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
	req: NextRequest,
	{ params }: { params: { postId: string } },
) {
	try {
		const body = await req.json();

		const { title, content, description } = body;

		if (!title) {
			return new NextResponse("Title is required", { status: 400 });
		}
		if (!content) {
			return new NextResponse("Content is required", { status: 400 });
		}
		if (!params.postId) {
			return new NextResponse("Post ID is required", { status: 400 });
		}

		const session = await getServerSession(authOptions);

		if (!session) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		const user = await prismadb.user.findUnique({
			where: {
				email: session.user?.email!,
			},
		});

		if (!user) {
			return new NextResponse("User doesnt exists", { status: 400 });
		}

		const isAdmin = user.role === "ADMIN";

		if (!isAdmin) {
			return new NextResponse("Unauthorized", { status: 403 });
		}

		const post = await prismadb.post.updateMany({
			where: {
				id: params.postId,
			},
			data: {
				title,
				content,
				description,
			},
		});

		return NextResponse.json(post);
	} catch (error) {
		console.log("[POSTS_POST]", error);
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { postId: string } },
) {
	try {
		if (!params.postId) {
			return new NextResponse("Post ID is required", { status: 400 });
		}

		const session = await getServerSession(authOptions);

		if (!session) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		const user = await prismadb.user.findUnique({
			where: {
				email: session.user?.email!,
			},
		});

		if (!user) {
			return new NextResponse("User doesnt exists", { status: 400 });
		}

		const isAdmin = user.role === "ADMIN";

		if (!isAdmin) {
			return new NextResponse("Unauthorized", { status: 403 });
		}

		const post = await prismadb.post.deleteMany({
			where: {
				id: params.postId,
			},
		});

		return NextResponse.json(post);
	} catch (error) {
		console.log("[POSTS_POST]", error);
	}
}
