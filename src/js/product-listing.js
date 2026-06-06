import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

// Add this function at the top
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

// Load header THEN update cart count
loadHeaderFooter().then(() => {
  updateCartCount();
});

const category = getParam("category");
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
const listing = new ProductList(category, dataSource, element);

listing.init();
