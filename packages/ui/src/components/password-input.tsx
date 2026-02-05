"use client";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@chrono/ui/components/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";

interface PasswordInputProps
	extends Omit<ComponentProps<typeof InputGroupInput>, "type"> {
	showToggle?: boolean;
}

function PasswordInput({ showToggle = true, ...props }: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<InputGroup>
			<InputGroupInput type={showPassword ? "text" : "password"} {...props} />
			{showToggle && (
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						aria-label={showPassword ? "Hide password" : "Show password"}
						aria-pressed={showPassword}
						onClick={togglePasswordVisibility}
					>
						{showPassword ? <EyeOffIcon /> : <EyeIcon />}
					</InputGroupButton>
				</InputGroupAddon>
			)}
		</InputGroup>
	);
}

export { PasswordInput, type PasswordInputProps };
