import Layout from "../layout";
import { UserContextWrapper } from "../hooks/useUser";
import { ChakraProvider } from "@chakra-ui/react";
import { Theme, Fonts } from "../layout/theme";
import React from "react";

// @ts-ignore
BigInt.prototype.toJSON = function () {
	const int = Number.parseInt(this.toString());
	return int ?? this.toString();
};

export default function MyApp({ Component, pageProps }) {
	return (
		<UserContextWrapper>
			<ChakraProvider theme={Theme}>
				<Fonts />
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</ChakraProvider>
		</UserContextWrapper>
	);
}
