const typescript = require("@rollup/plugin-typescript");

module.exports = {
  input: "./index.ts",
  output: [
    {
      file: "./lib/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "./lib/index.mjs",
      format: "es",
      sourcemap: true,
    },
    {
      file: "./lib/index.browser.js",
      format: "iife",
      sourcemap: true,
    },
    {
      file: "./lib/index.browser.mjs",
      format: "iife",
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
};
