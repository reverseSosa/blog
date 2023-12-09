import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

import { authOptions } from "@/lib/authOptions";

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { commentId: string } },
) {
	try {
		if (!params.commentId) {
			return new NextResponse("Comment ID is required", { status: 400 });
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

		const comment = await prismadb.comment.deleteMany({
			where: {
				id: params.commentId,
			},
		});

		return NextResponse.json(comment);
	} catch (error) {
		console.log("[COMMENTS_POST]", error);
	}
}
