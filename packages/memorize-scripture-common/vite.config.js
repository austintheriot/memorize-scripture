import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MemorizeScriptureCommon",
      formats: ["es", "umd"],
      fileName: (format) => `memorize-scripture-common.${format}.js`,
    },
    rollupOptions: {
      input: ["./src/index.ts"],
    },
  },
});
