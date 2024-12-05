import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import "@fontsource/dm-sans";

const config: ThemeConfig = {
	initialColorMode: "dark",
	useSystemColorMode: false,
};

export const Theme = extendTheme({
	config,
	components: {
		Link: {
			baseStyle: {
				color: "white",
			},
		},
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
		primary: {
			dark: "#1A202C",
			light: "white",
		},
		text: {
			dark: "#000",
			light: "#fff",
		},
	},
	gradients: {
		"bg-gradient": "linear-gradient(to right top, #2a1036, #361149, #43105d, #4f0f71, #5b0b87)",
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
				fontFamily: "DM Sans",
				fontSize: "15px",
				bg: mode(
					"linear-gradient(to right top,#2a1036,#361149,#43105d,#4f0f71,#5b0b87)",
					"linear-gradient(to right top,#2a1036,#361149,#43105d,#4f0f71,#5b0b87)",
				)(props),
			},
		}),
	},
});
