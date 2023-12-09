import { ru } from "date-fns/locale";
import { format, formatDistanceToNow, isToday } from "date-fns";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface CommentCardProps {
	username: string;
	content: string;
	createdAt: Date;
}

const CommentCard: React.FC<CommentCardProps> = async ({
	username,
	content,
	createdAt,
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{username}</CardTitle>
				<CardDescription>
					{isToday(createdAt)
						? `${formatDistanceToNow(createdAt, { locale: ru })} назад`
						: format(createdAt, "dd MMMM yyyy", { locale: ru })}
				</CardDescription>
			</CardHeader>
			<CardContent>{content}</CardContent>
		</Card>
	);
};

export default CommentCard;
