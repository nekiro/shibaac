import { IconButton, IconButtonProps, useColorMode } from "@chakra-ui/react";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";

export interface DarkModeButtonProps extends IconButtonProps {}

export const DarkModeButton = ({ ...props }: DarkModeButtonProps) => {
	const { toggleColorMode, colorMode } = useColorMode();

	return (
		<IconButton
			title={colorMode === "light" ? "Dark mode" : "Light mode"}
			icon={colorMode === "dark" ? <MdOutlineDarkMode size="25px" /> : <MdDarkMode size="25px" />}
			variant="ghost"
			color="white"
			_hover={{ color: "violet.300" }}
			_active={{}}
			onClick={toggleColorMode}
			{...props}
		/>
	);
};
