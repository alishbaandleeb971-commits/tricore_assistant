import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: "dist",
    lib: {
      entry: "src/index.tsx",
      name: "TriCoreWidget",
      fileName: () => "widget.js",
      formats: ["iife"]
    }
  }
});
