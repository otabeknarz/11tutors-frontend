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
				port: "443",
				pathname: "/media/**",
			},
		],
	},
};

export default nextConfig;
