import { useRouter } from "next/router";
import { Flex, Spacer, Box } from "@chakra-ui/react";
import DropdownButton from "@component/DropdownButton";
import TextInput from "@component/TextInput";
import { User } from "@lib/session";
import { NavigationItems } from "./index";

export interface DesktopNavigationProps {
	user?: User;
	navigationItems: NavigationItems[];
}

export const DesktopNavigation = ({ user, navigationItems }: DesktopNavigationProps) => {
	const router = useRouter();

	return (
		<Flex bgColor="violet.400" height="fit-content" marginBottom="1.5em" flexDir="row" borderRadius="md">
			{navigationItems.map((item) => (
				<DropdownButton key={item.text} text={item.text} hasMenu={item.hasMenu} list={item.menuItems} href={item.href} />
			))}

			<Box alignSelf="center">
				<form
					onSubmit={(event) => {
						event.preventDefault();
						const form = event.currentTarget;
						const searchValue = (form.elements.namedItem("search") as any)?.value;
						if (searchValue) {
							router.push(`/character/${searchValue}`);
							form.reset();
						}
					}}
				>
					<TextInput name="search" placeholder="Search character..." />
				</form>
			</Box>

			<Spacer />
			{user ? (
				<DropdownButton
					text={user.name}
					hasMenu={true}
					list={[
						{ text: "Account Management", url: "/account" },
						{ text: "Sign out", url: "/account/logout" },
					]}
				/>
			) : (
				<>
					<DropdownButton text="Sign Up" href="/account/register" />
					<DropdownButton text="Sign In" href="/account/login" />
				</>
			)}
		</Flex>
	);
};
