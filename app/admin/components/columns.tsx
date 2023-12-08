"use client";

import { format, formatDistanceToNow } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { ru } from "date-fns/locale";

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
