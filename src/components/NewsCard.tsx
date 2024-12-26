import { Text, VStack, StackProps, HStack, Image, Heading } from "@chakra-ui/react";
import { IoMdTime } from "react-icons/io";
import { formatDate } from "@lib/.";
import { HiNewspaper } from "react-icons/hi2";
import { useColors } from "@hook/useColors";
import sanitize from "sanitize-html";
import Link from "./Link";

const maxChars = 180;

export interface NewsCardProps extends StackProps {
	header?: string;
	date?: string | null;
	html: string;
	id: string;
	image?: string | null;
	author?: string | null;
}

export const NewsCard = ({ date, html, header, image, id, author, ...props }: NewsCardProps) => {
	const { newsBgColor, textColor } = useColors();

	return (
		<HStack color={textColor} bgColor={newsBgColor} gap={10} borderRadius="md" padding={5} align="start" {...props}>
			<Link href={`/news/${id}`}>
				<Image
					src={image ?? "https://archive.org/download/placeholder-image/placeholder-image.jpg"}
					maxW="200px"
					alt="news image"
					borderRadius="md"
				/>
			</Link>
			<VStack align="start" maxW="100%">
				<Heading size="md">{header}</Heading>
				<Text color={textColor} opacity="0.6" fontSize="xs">
					By {author ?? "admin"}
				</Text>
				<Text
					w="full"
					maxW="100%"
					marginTop={2}
					overflowWrap="break-word"
					whiteSpace="normal"
					wordBreak="break-word"
					fontSize="sm"
					dangerouslySetInnerHTML={{ __html: sanitize(html.length > maxChars ? html.slice(0, maxChars) + "..." : html) }}
				/>
			</VStack>
			{/* <Flex bgColor={bgColor} borderBottomWidth="1px" borderTopWidth="1px" borderColor="#ddd" borderRadius={borderRadius}>
				<Grid margin="10px" width="100%" templateColumns="1fr auto">
					<Flex flexDirection="row" alignItems="center" gap="5px">
						<HiNewspaper />
						<Text color={textColor}>{header}</Text>
					</Flex>
					{date && (
						<Box display="flex" alignItems="center" justifyContent="flex-end">
							<IoMdTime />
							<Text>{formatDate(date)}</Text>
						</Box>
					)}
				</Grid>
			</Flex>
			<Box padding="10px">{isLoading ? <Loader /> : children}</Box> */}
		</HStack>
	);
};
