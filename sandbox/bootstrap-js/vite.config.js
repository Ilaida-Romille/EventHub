import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
   resolve: {
      alias: {
         "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap")
      }
   },
   server: {
      port: 8080,
      hot: true
   },
   test: {}
});
