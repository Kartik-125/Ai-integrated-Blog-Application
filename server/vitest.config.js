import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./tests/setup.js"],
    // mongodb-memory-server downloads a real MongoDB binary the first
    // time it runs (cached after that) — the default timeout is too
    // short for that first download, so this gives it room.
    hookTimeout: 60000,
    testTimeout: 20000,
  },
});