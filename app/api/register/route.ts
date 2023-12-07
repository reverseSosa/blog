import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const { username, email, password } = body;

		if (!username || !email || !password) {
			return new NextResponse(
				`${!username ? "Username" : !email ? "Email" : "Password"} is required`,
				{ status: 400 },
			);
		}

		const exist = await prismadb.user.findUnique({
			where: {
				email: email,
			},
		});

		if (exist) {
			return new NextResponse("User already exists", { status: 400 });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prismadb.user.create({
			data: {
				name: username,
				email: email.toLowerCase().trim(),
				password: hashedPassword,
			},
		});

		return NextResponse.json(user);
	} catch (error) {
		console.log("[REGISTER_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
