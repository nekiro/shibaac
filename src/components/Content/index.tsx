import { Flex, FlexProps } from "@chakra-ui/react";
import { ContentHeader } from "./ContentHeader";
import { useColors } from "@hook/useColors";
import { ContentBody } from "./ContentBody";

export interface ContentProps extends FlexProps {}

export const Content = ({ children, ...props }: ContentProps) => {
	const { bgColor } = useColors();

	return (
		<Flex
			as="main"
			marginTop="5rem"
			maxWidth={{ lg: "1050px", base: "100%" }}
			paddingX="5rem"
			paddingY="2rem"
			rounded="md"
			bgColor={bgColor}
			direction="column"
			marginX="auto"
			w="100%"
			borderWidth="1px"
			borderColor="violet.500"
			{...props}
		>
			{children}
		</Flex>
	);
};

Content.Header = ContentHeader;
Content.Body = ContentBody;
