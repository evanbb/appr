const fs = require("fs");
const path = require("path");
const watcher = require("chokidar");

watcher
  .watch([
      path.dirname(require.resolve("@appr/apps--todo-api")),
      path.dirname(require.resolve("@appr/core")),
      path.dirname(require.resolve("@appr/domain")),
    ], {
    recursive: true,
  })
  .on("all", function () {
    fs.writeFileSync(
      path.resolve(__dirname, "../src/version.ts"),
      `export default ${Date.now()}`,
      "utf-8"
    );
  });
