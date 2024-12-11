import { Heading, HeadingProps } from "@chakra-ui/react";

export interface ContentHeaderProps extends HeadingProps {}

export const ContentHeader = ({ children, ...props }: ContentHeaderProps) => {
	return (
		<Heading textAlign="center" paddingBottom="1em" {...props}>
			{children}
		</Heading>
	);
};
