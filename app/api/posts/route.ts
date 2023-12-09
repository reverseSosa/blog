import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

import { authOptions } from "@/lib/authOptions";

export async function GET() {
	try {
		const posts = await prismadb.post.findMany();

		return NextResponse.json(posts);
	} catch (error) {
		console.log("[POSTS_GET]", error);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const { title, content, description } = body;

		if (!title) {
			return new NextResponse("Title is required", { status: 400 });
		}
		if (!content) {
			return new NextResponse("Title is required", { status: 400 });
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

		const post = await prismadb.post.create({
			data: {
				title,
				content,
				description,
				userId: user.id,
			},
		});

		return NextResponse.json(post);
	} catch (error) {
		console.log("[POSTS_POST]", error);
	}
}
