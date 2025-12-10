import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  externals: {
    exclude: [/\\.test\\./], // Exclude test files from the build
  },
});
