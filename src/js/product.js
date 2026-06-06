import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
});

function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
  const totalCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );

  const countElement = document.querySelector(".cart-count");
  if (countElement) {
    countElement.textContent = totalCount;
    countElement.style.display = totalCount > 0 ? "block" : "none";
  }
}

const dataSource = new ExternalServices("tents");
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();
