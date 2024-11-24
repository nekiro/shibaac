import Layout from "../layout";
import { UserContextWrapper } from "../hooks/useUser";
import { ChakraProvider } from "@chakra-ui/react";
import { Theme, Fonts } from "../layout/theme";
import React from "react";
import { trpc } from "../utils/trpc";

// @ts-ignore
BigInt.prototype.toJSON = function () {
	const int = Number.parseInt(this.toString());
	return int ?? this.toString();
};

const MyApp = ({ Component, pageProps }: any) => {
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
};

export default trpc.withTRPC(MyApp);
