import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  const products = getLocalStorage("so-cart") || []; // get cart array of items from local storage if null set to empty array

  let found = products.find((item) => item.Id === product.Id); // check if product is already in cart
  if (found) {
    found.quantity += 1; // if product is already in cart increase quantity by 1
  } else {
    products.push(product);
  }
  setLocalStorage("so-cart", products);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
