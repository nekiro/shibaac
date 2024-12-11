import { Text, Image, Flex, IconButton, VStack, Accordion, AccordionButton, AccordionItem, AccordionPanel, HStack } from "@chakra-ui/react";
import { TopBarItem } from "@layout/TopBar/TopBarItem";
import { MdOutlineClose } from "react-icons/md";
import { navigationItems } from "@layout/TopBar/index";
import Button from "@component/Button";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { trpc } from "@util/trpc";
import { useRouter } from "next/router";

export interface MobileMenuProps {
	onClose: () => void;
}

export const MobileMenu = ({ onClose }: MobileMenuProps) => {
	const user = trpc.me.me.useQuery().data;
	const router = useRouter();

	const onButtonClick = (href: string) => {
		onClose();
		router.push(href);
	};

	return (
		<Flex flexDir="column" position="fixed" top="0" left="0" h="100%" w="100%" zIndex="overlay" bgColor="black">
			<VStack w="100vw">
				<HStack h="50px" paddingX="1em" justifyContent="space-between" w="100%" margin={0}>
					<TopBarItem paddingLeft={0} userSelect="none" pointerEvents="none">
						<Image height="35px" src="/images/header.png" alt="shibaac" />
						<Text fontSize="lg" color="white" ml="10px">
							Shibaac
						</Text>
					</TopBarItem>
					<IconButton aria-label="Open Menu" icon={<MdOutlineClose size="20px" />} color="white" variant="outline" onClick={onClose} />
				</HStack>
				<Accordion width="100%" allowMultiple>
					{navigationItems.map((item) => (
						<AccordionItem key={`${item.text}${item.href}`}>
							{({ isExpanded }) => (
								<>
									<AccordionButton
										display="flex"
										alignItems="center"
										justifyContent="space-between"
										p={4}
										color="white"
										onClick={item.href ? () => onButtonClick(item.href!) : undefined}
									>
										{item.text}
										{item.hasMenu && (isExpanded ? <IoChevronUp fontSize="24px" /> : <IoChevronDown fontSize="24px" />)}
									</AccordionButton>
									{item.hasMenu && (
										<AccordionPanel>
											{item.menuItems?.map((item) => (
												<Button
													key={`sub_${item.text}${item.url}`}
													variant="link"
													fontSize="sm"
													href={item.url}
													color="white"
													onClick={() => onButtonClick(item.url)}
													w="100%"
													rounded="none"
													justifyContent="flex-start"
												>
													{item.text}
												</Button>
											))}
										</AccordionPanel>
									)}
								</>
							)}
						</AccordionItem>
					))}
					{user ? (
						<AccordionItem>
							<AccordionButton
								display="flex"
								color="white"
								alignItems="center"
								justifyContent="space-between"
								p={4}
								onClick={() => onButtonClick("/account")}
							>
								Account
							</AccordionButton>
						</AccordionItem>
					) : (
						<AccordionItem>
							<AccordionButton
								display="flex"
								alignItems="center"
								justifyContent="space-between"
								p={4}
								color="white"
								onClick={() => onButtonClick("/account/login")}
							>
								Login
							</AccordionButton>
							<AccordionButton
								display="flex"
								alignItems="center"
								justifyContent="space-between"
								p={4}
								color="white"
								onClick={() => onButtonClick("/account/register")}
							>
								Register
							</AccordionButton>
						</AccordionItem>
					)}
				</Accordion>
			</VStack>
		</Flex>
	);
};
