import * as esbuild from "esbuild";

async function build() {
  try {
    await esbuild.build({
      entryPoints: ["src/tracker/index.ts"],
      bundle: true,
      minify: true,
      platform: "browser",
      sourcemap: false,
      format: "iife",
      outfile: "public/script.js",
      target: "es2015",
    });
    console.info("Build successful");
  } catch (e) {
    console.error("Failed to build: ", e);
    process.exit(1);
  }
}

build();
