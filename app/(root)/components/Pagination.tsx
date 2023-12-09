import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";

interface PaginationProps {
	page?: string;
	totalPages: number;
	hasNextPage: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
	page = 1,
	totalPages,
	hasNextPage,
}) => {
	const currentPage = Math.min(Math.max(Number(page), 1), totalPages);

	const getPagesToShow = () => {
		let startPage = currentPage - 2;
		let endPage = currentPage + 2;

		if (currentPage <= 3) {
			startPage = 1;
			endPage = totalPages;
		} else if (currentPage >= totalPages - 2) {
			startPage = totalPages - 4;
			endPage = totalPages;
		}

		return Array.from(
			{ length: endPage - startPage + 1 },
			(_, i) => startPage + i,
		);
	};

	const pages = getPagesToShow();

	return (
		<div className="flex items-center justify-center space-x-6 mt-8">
			<Link
				href={`?page=${currentPage - 1}`}
				className={cn(
					buttonVariants({ variant: "ghost", size: "icon" }),
					currentPage === 1 && "pointer-events-none",
				)}
			>
				<ChevronLeft className="w-5 h-5" />
			</Link>

			<nav
				aria-label="Pagination"
				className="relative z-0 inline-flex space-x-2 rounded-md"
			>
				{pages.map((p, i) => (
					<Link
						key={p}
						className={cn(
							buttonVariants({ variant: "ghost", size: "icon" }),
							p === currentPage &&
								"pointer-events-none bg-foreground text-background",
							i === 0 ? "rounded-l-md" : "",
							i === pages.length - 1 ? "rounded-r-md" : "",
						)}
						href={`?page=${p}`}
					>
						{p}
					</Link>
				))}
			</nav>

			<Link
				href={`?page=${currentPage + 1}`}
				className={cn(
					buttonVariants({ variant: "ghost", size: "icon" }),
					!hasNextPage && "pointer-events-none",
				)}
			>
				<ChevronRight className="w-5 h-5" />
			</Link>
		</div>
	);
};

export default Pagination;
