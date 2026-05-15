import {resolve} from "path";
import {defineConfig} from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/product_pages/index.html"),
        // This single line replaces product1, product2, product3, and product4
        product: resolve(__dirname, "src/product_pages/index.html"),
      },
    },
  },
});
