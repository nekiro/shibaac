import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { Global } from "@emotion/react";
import React from "react";

export const Fonts = () => (
	<Global
		styles={`
        @font-face {
            font-family: Roboto;
            src: url(/fonts/Roboto-Light.ttf);
        }
        @font-face {
            font-family: Roboto;
            src: url(/fonts/Roboto-Bold.ttf);
            font-weight: bold;
        }
    `}
	/>
);

export const Theme = extendTheme({
	config: {
		initialColorMode: "dark",
		useSystemColorMode: false,
	},
	colors: {
		violet: {
			50: "#f7ebff",
			100: "#ddc9eb",
			200: "#c3a6d9",
			300: "#aa84c9",
			400: "#9261b8",
			500: "#78479e",
			600: "#5e377c",
			700: "#43275a",
			800: "#291738",
			900: "#100619",
		},
	},

	styles: {
		global: (props: any) => ({
			html: {
				height: "100%",
			},
			body: {
				height: "100%",
				margin: "0px",
				backgroundRepeat: "no-repeat",
				backgroundAttachment: "fixed",
				fontFamily: "Roboto",
				fontSize: "15px",
				bg: mode(
					"linear-gradient(to right top,#2a1036,#361149,#43105d,#4f0f71,#5b0b87)",
					"linear-gradient(to right top,#2a1036,#361149,#43105d,#4f0f71,#5b0b87)",
				)(props),
			},
		}),
	},
	fonts: {
		body: "Roboto, sans-serif",
	},
});
