import { Flex, Spacer, Menu, MenuButton, MenuList, MenuItem, MenuGroup, IconButton, Link } from "@chakra-ui/react";
import DropdownButton from "@component/DropdownButton";
import { RxHamburgerMenu } from "react-icons/rx";
import { User } from "@lib/session";
import { NavigationItems } from "./index";

export interface MobileNavigationProps {
	user?: User;
	navigationItems: NavigationItems[];
}

export const MobileNavigation = ({ user, navigationItems }: MobileNavigationProps) => {
	return (
		<Flex bgColor="violet.400" height="fit-content" marginBottom="1.5em" flexDir="row" borderRadius="md">
			<Menu>
				<MenuButton
					as={IconButton}
					aria-label="Menu"
					icon={<RxHamburgerMenu />}
					variant="outline"
					_hover={{}}
					color={"white"}
					_active={{ bgColor: "white", color: "black" }}
					alignSelf={"center"}
					marginLeft={1}
				/>
				<MenuList>
					{navigationItems.map((item) => {
						return item.hasMenu ? (
							<MenuGroup key={item.text} title={item.text}>
								{item.menuItems!.map((subItem) => {
									return <MenuItem key={subItem.text}>{subItem.text}</MenuItem>;
								})}
							</MenuGroup>
						) : (
							<MenuItem key={item.text} as={Link} href={item.href}>
								{item.text}
							</MenuItem>
						);
					})}
				</MenuList>
			</Menu>

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
