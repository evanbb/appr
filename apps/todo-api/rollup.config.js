import ts from "@rollup/plugin-typescript";
import nodemon from "nodemon";
import path from "path";

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

const isWatch = process.env.ROLLUP_WATCH === "true";
const api = function api({ outputDir = "dist/index.js" } = {}) {
  let mon = null;
  let restarting = false;

  return {
    name: "rollup-plugin-api",

    options() {
      // start the api
      if (!mon) {
        console.log("Starting the app!");
        mon = nodemon(outputDir);

        mon.on("restart", function () {
          restarting = true;
        });

        mon.on("exit", function () {
          if (!restarting) {
            process.kill(process.pid);
            return;
          }

          restarting = false;
        });
      }
    },
  };
};

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
    isWatch ? api() : null,
    moduleWatcher({
      moduleIds: ["@appr/core", "@appr/domain"],
    }),
  ].filter(Boolean),
};
