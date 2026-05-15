import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart");

  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  cartItems.push(product);

  setLocalStorage("so-cart", cartItems);
}

// add to cart button event handler
=======
const product = new ProductDetails(productId, dataSource);
product.init();

/* // add to cart button event handler
>>>>>>> 3fdf26c1246813178513778cb7c8c99762ec12ae
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);

  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler); */
