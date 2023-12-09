"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";

import { like } from "../actions";

interface LikeButtonProps {
	likes: number;
	liked: boolean;
	userId: string;
	postId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
	likes,
	liked,
	userId,
	postId,
}) => {
	const [likesCount, setLikesCount] = useState(likes);
	const [likedLocal, setLikedLocal] = useState(liked);

	const onLike = async () => {
		setLikedLocal(!likedLocal);
		setLikesCount((prev) => (likedLocal ? prev - 1 : prev + 1));
		await like(userId, postId);
	};

	return (
		<button onClick={onLike} className="flex items-center cursor-pointer">
			<Heart
				className={cn(
					"mr-2 stroke-1",
					likedLocal && "fill-destructive text-destructive",
				)}
			/>
			{likesCount}
		</button>
	);
};

export default LikeButton;
