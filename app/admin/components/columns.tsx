"use client";

import { format, formatDistanceToNow } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export type Post = {
	id: string;
	title: string;
	comments: number;
	likes: number;
	updatedAt: Date;
	createdAt: Date;
};

export const columns: ColumnDef<Post>[] = [
	{
		accessorKey: "title",
		header: "Заголовок",
		cell: ({ row }) => (
			<Link
				href={`/admin/${row.original.id}`}
				className={buttonVariants({ variant: "link" })}
			>
				{row.original.title}
			</Link>
		),
	},
	{
		accessorKey: "comments",
		header: "Комментарии",
	},
	{
		accessorKey: "likes",
		header: "Лайки",
	},
	{
		accessorKey: "updatedAt",
		header: "Обновлена",
		cell: ({ row }) =>
			`${formatDistanceToNow(row.original.updatedAt, { locale: ru })} назад`,
	},
	{
		accessorKey: "createdAt",
		header: "Создана",
		cell: ({ row }) =>
			format(row.original.createdAt, "HH:mm d MMM yy", { locale: ru }),
	},
];
