import { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";
import { Theme } from "@layout/theme";

const MyDocument = () => {
	return (
		<Html lang="en">
			<Head />
			<body>
				<ColorModeScript initialColorMode={Theme.config.initialColorMode} />
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default MyDocument;
