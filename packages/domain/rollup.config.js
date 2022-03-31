import ts from "@rollup/plugin-typescript";
import path from "path";

function moduleWatcher({ paths }) {
  return {
    name: "rollup-plugin-module-watcher",
    buildStart() {
      for (const p of paths) {
        this.addWatchFile(p);
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
      paths: [path.resolve(__dirname, "../core/dist")],
    }),
  ],
};
