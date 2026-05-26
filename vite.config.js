import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
<<<<<<< HEAD
        // We add this line to register the new page:
=======
>>>>>>> 9778eb445729400e82202111f0344cf61d2389c6
        product_listing: resolve(__dirname, "src/product_listing/index.html"),
      },
    },
  },
});
