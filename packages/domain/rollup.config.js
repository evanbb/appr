import ts from "@rollup/plugin-typescript";
import path from 'path';

function moduleWatcher({ moduleIds }) {
  return {
    name: "rollup-plugin-module-watcher",
    buildStart() {
      for (const id of moduleIds) {
        const resolvedModule = require.resolve(id);
        // watch the directory in case the file hasn't been written yet
        this.addWatchFile(path.dirname(resolvedModule));
      }
    },
  };
}

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [
    ts({
      noEmitOnError: !process.env.ROLLUP_WATCH,
    }),
    moduleWatcher({
      moduleIds: ["@appr/core"],
    }),
  ],
};
