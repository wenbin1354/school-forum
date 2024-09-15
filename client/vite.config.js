import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/",
	server: {
		open: true, // Open the browser when starting the development server
		// host: true,
		proxy: {
			"/api": {
				target: "https://www.schoolforum.software",
				// target: "http://127.0.0.1:8000",
				changeOrigin: true,
				secure: true,
				configure: (proxy, _options) => {
					proxy.on("error", (err, _req, _res) => {
						console.log("proxy error", err);
					});
					proxy.on("proxyReq", (proxyReq, req, _res) => {
						console.log("Sending Request to the Target:", req.method, req.url);
					});
					proxy.on("proxyRes", (proxyRes, req, _res) => {
						console.log(
							"Received Response from the Target:",
							proxyRes.statusCode,
							req.url
						);
					});
				},
			},
		},
	},
});
