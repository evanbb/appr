import ts from "@rollup/plugin-typescript";

function moduleWatcher({ moduleIds }) {
  return {
    name: "rollup-plugin-module-watcher",
    buildStart() {
      for (const id of moduleIds) {
        this.addWatchFile(require.resolve(id));
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
    ts(),
    moduleWatcher({
      moduleIds: ["@appr/core"],
    }),
  ],
};
