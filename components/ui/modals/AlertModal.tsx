import React from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
	title: string;
	description: string;
	action: string;
	open: boolean;
	onClose: () => void;
	onSubmit: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
	title,
	description,
	action,
	open,
	onClose,
	onSubmit,
}) => {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Отмена
					</Button>
					<Button variant="destructive" onClick={onSubmit}>
						{action}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AlertModal;
