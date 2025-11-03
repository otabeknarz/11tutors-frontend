import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "8000",
				pathname: "/media/**",
			},
			{
				protocol: "https",
				hostname: "api.11-tutors.com",
				pathname: "/media/**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "3df15cd5507532f9026af02a9599fc77.r2.cloudflarestorage.com",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
