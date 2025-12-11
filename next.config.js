/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	eslint: {
		// Skip ESLint during production builds to avoid blocking the build.
		// Fix lint issues separately to keep code quality high.
		ignoreDuringBuilds: true,
	},
};

export default config;
