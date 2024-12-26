import { useColorModeValue } from "@chakra-ui/react";

export interface UseColorsReturnType {
	textColor: string;
	btnTextColor: string;
	bgColor: string;
	hoverColor: string;
	linkColor: string;
	inputBgColor: string;
	newsBgColor: string;
}

export const useColors = (): UseColorsReturnType => {
	const textColor = useColorModeValue("text.dark", "text.light");
	const btnTextColor = useColorModeValue("text.light", "text.dark");
	const bgColor = useColorModeValue("primary.light", "primary.dark");
	const hoverColor = useColorModeValue("violet.100", "gray.700");
	const linkColor = useColorModeValue("violet.400", "violet.200");
	const inputBgColor = useColorModeValue("violet.100", "violet.100");
	const newsBgColor = useColorModeValue("gray.200", "gray.700");

	return { textColor, bgColor, hoverColor, linkColor, inputBgColor, btnTextColor, newsBgColor };
};
