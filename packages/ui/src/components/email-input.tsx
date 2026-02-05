"use client";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@chrono/ui/components/input-group";
import { MailIcon } from "lucide-react";
import type { ComponentProps } from "react";

interface EmailInputProps
	extends Omit<ComponentProps<typeof InputGroupInput>, "type"> {
	showIcon?: boolean;
}

function EmailInput({ showIcon = true, ...props }: EmailInputProps) {
	return (
		<InputGroup>
			<InputGroupInput type="email" {...props} />
			{showIcon && (
				<InputGroupAddon align="inline-end">
					<InputGroupText>
						<MailIcon />
					</InputGroupText>
				</InputGroupAddon>
			)}
		</InputGroup>
	);
}

export { EmailInput, type EmailInputProps };
