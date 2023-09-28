// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	images: {
		domains: ['localhost', 'shibaac.vercel.app'],
	},
	webpackDevMiddleware: config => {
		config.watchOptions = {
			poll: 1000,
			aggregateTimeout: 300,
		}
		return config
	},
}

module.exports = nextConfig