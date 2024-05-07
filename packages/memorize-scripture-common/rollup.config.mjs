import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "es",
    },
  ],
  plugins: [
    // allow rollup to bundle node_module deps
    nodeResolve(),
    // allow using TS
    typescript({ outputToFilesystem: true }),
  ],
};
