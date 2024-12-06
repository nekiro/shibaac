import Layout from "../layout";
import { ChakraProvider } from "@chakra-ui/react";
import { Theme } from "@layout/theme";
import React from "react";
import { trpc } from "../utils/trpc";

// @ts-ignore
BigInt.prototype.toJSON = function () {
	const int = Number.parseInt(this.toString());
	return int ?? this.toString();
};

const App = ({ Component, pageProps }: any) => {
	return (
		<ChakraProvider theme={Theme}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ChakraProvider>
	);
};

export default trpc.withTRPC(App);
