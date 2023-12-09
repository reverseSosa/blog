import Link from "next/link";
import { ru } from "date-fns/locale";
import { Heart, MessageSquare } from "lucide-react";
import { format, formatDistanceToNow, isToday } from "date-fns";

import { Post } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExtendedPost extends Post {
	comments: number;
	likes: number;
	name: string;
	lastCommentDate?: Date | null;
	lastUserName?: string | null;
}

interface PostCardProps {
	post: ExtendedPost;
}

const PostCard: React.FC<PostCardProps> = async ({ post }) => {
	const { title, description, createdAt, comments, likes, name, id } = post;
	return (
		<Link href={`/${id}`}>
			<Card className="cursor-pointer">
				<CardHeader>
					<CardTitle>
						{title.charAt(0).toUpperCase() + title.slice(1)}
					</CardTitle>
					<div className="flex items-center text-xs md:text-sm text-muted-foreground gap-2">
						<span>{name}</span>
						<span>
							{isToday(createdAt)
								? `${formatDistanceToNow(createdAt, { locale: ru })} назад`
								: format(createdAt, "dd MMMM yyyy", { locale: ru })}
						</span>
						<span className="flex items-center">
							<MessageSquare className="w-3.5 h-3.5 mr-1" /> {comments}
						</span>
						<span className="flex items-center">
							<Heart className="w-3.5 h-3.5 mr-1" /> {likes}
						</span>
					</div>
				</CardHeader>
				{description && (
					<CardContent className="text-sm md:text-base">
						{description}
					</CardContent>
				)}
			</Card>
		</Link>
	);
};

export default PostCard;
