import { Text, Image } from "@chakra-ui/react";
import { TopBarItem } from "@layout/TopBar/TopBarItem";
import Link from "@component/Link";
import Label from "./Label";

export const Logo = () => {
	return (
		<Link href="/" style={{ height: "100%", textDecoration: "none" }}>
			<TopBarItem paddingLeft={0} userSelect="none" pointerEvents="none">
				<Image height="35px" boxSize="35px" src="/images/header.png" alt="shibaac" />
				<Text fontSize="lg" color="white" ml="10px">
					Shibaac
				</Text>
				<Label fontSize="xs" margin="0" marginLeft={1}>
					Alpha
				</Label>
			</TopBarItem>
		</Link>
	);
};
