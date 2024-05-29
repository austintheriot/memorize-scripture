import fs from "fs";
import { PluginOption, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const base64Loader: PluginOption = {
	name: "base64-loader",
	transform(_: any, id: string) {
		const [path, query] = id.split("?");
		if (query != "base64") return null;

		const data = fs.readFileSync(path);
		const base64 = data.toString("base64");

		return `export default '${base64}';`;
	},
};

export default defineConfig(({ _command, _mode }) => {
	return {
		plugins: [tsconfigPaths(), base64Loader],
	};
});
