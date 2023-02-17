const typescript = require("@rollup/plugin-typescript");

const pkg = require("./package.json");

module.exports = {
  input: "./index.ts",
  output: [
    {
      file: pkg.exports["."].require,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: pkg.exports["."].import,
      format: "esm",
      sourcemap: true,
    },
    {
      file: "./lib/index.browser.js",
      format: "iife",
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
};
