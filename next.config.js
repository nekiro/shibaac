// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	images: {
		domains: ["localhost", "shibaac.vercel.app"],
	},
	webpack: (config, { dev }) => {
		if (dev) {
			config.watchOptions = {
				poll: 1000,
				aggregateTimeout: 300,
			};
		}
		return config;
	},
};

module.exports = nextConfig;
