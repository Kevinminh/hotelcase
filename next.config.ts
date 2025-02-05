import { NextConfig } from "next"

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "**",
			},

			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "**",
			},
		],
	},
}

export default nextConfig
