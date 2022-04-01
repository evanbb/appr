const fs = require("fs");
const path = require("path");
const watcher = require("chokidar");

watcher
  .watch([
    path.resolve(__dirname, "../../todo-api/dist/**"),
    path.resolve(__dirname, "../../../packages/core/dist/**"),
    path.resolve(__dirname, "../../../packages/domain/dist/**"),
  ])
  .on("all", function () {
    fs.writeFileSync(
      path.resolve(__dirname, "../src/version.ts"),
      `const version = ${Date.now()};
export default version;
`,
      "utf-8"
    );
  });
