import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs"; // remove {} if it's default export
console.log("checkout page is working");
loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init();

// Recalculate when zip loses focus
document.querySelector("#zip").addEventListener("blur", () => {
  order.calculateOrderTotal();
});

// Submit the form
document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  
  const form = document.querySelector("#checkout-form"); // get the form element
  order.checkout(form); // pass it in
});