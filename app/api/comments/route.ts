import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
	try {
		const comments = await prismadb.comment.findMany();

		return NextResponse.json(comments);
	} catch (error) {
		console.log("[COMMENTS_GET]", error);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const { content, postId } = body;

		if (!content) {
			return new NextResponse("Content is required", { status: 400 });
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

		const comment = await prismadb.comment.create({
			data: {
				content,
				postId,
				userId: user.id,
				username: user.name!,
			},
		});

		return NextResponse.json(comment);
	} catch (error) {
		console.log("[COMMENTS_POST]", error);
	}
}
