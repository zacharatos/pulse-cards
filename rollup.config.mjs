import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const dev = process.env.ROLLUP_WATCH;

export default {
  input: "src/index.ts",
  output: {
    file: "dist/pulse-cards.js",
    format: "es",
    inlineDynamicImports: true,
    sourcemap: false,
  },
  plugins: [
    resolve({ browser: true }),
    typescript({ tsconfig: "./tsconfig.json", outDir: undefined, declaration: false }),
    !dev && terser({ format: { comments: false } }),
  ].filter(Boolean),
};
