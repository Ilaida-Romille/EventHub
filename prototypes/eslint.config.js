import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin";

export default defineConfig([
   {
      files: ["**/*.html"],
      plugins: {
         html
      },
      language: "html/html",
      rules: {
         "html/no-duplicate-class": "error",

         "html/no-duplicate-attrs": "error",
         "html/no-duplicate-id": "error",
         "html/require-button-type": "warn",

         "html/quotes": ["error", "double"],

         "html/require-lang": "error",
         "html/require-img-alt": "error",
         "html/require-frame-title": "warn",

         "html/require-title": "error",
         "html/no-multiple-h1": "warn",
         "html/require-meta-description": "warn"
      }
   }
]);
