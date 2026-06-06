import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import { updateCartCount } from "./cart.js";

updateCartCount();

// This initializes layouts smoothly
loadHeaderFooter();

// Instantiate the checkout class wrapper
// It uses the standard 'so-cart' localStorage key and targets the #order-summary element
const myCheckout = new CheckoutProcess("so-cart", "#order-summary");

// Initialize subtotal calculations when the DOM finishes loading
document.addEventListener("DOMContentLoaded", () => {
  myCheckout.init();
});

// Listen for the zip code entry to calculate tax, shipping, and final totals
const zipInput = document.getElementById("zip");

if (zipInput) {
  // The 'blur' event triggers the math right when the user tabs out or clicks away
  zipInput.addEventListener("blur", () => {
    if (zipInput.checkValidity() && zipInput.value.trim() !== "") {
      // Check your CheckoutProcess.mjs file for the exact method name casing:
      // If it uses lowercase 't', use calculateOrdertotal(). If uppercase, use calculateOrderTotal().
      if (typeof myCheckout.calculateOrdertotal === "function") {
        myCheckout.calculateOrdertotal();
      } else {
        myCheckout.calculateOrderTotal();
      }
    }
  });
}

// Intercept the form submission to send data to the API
const checkoutForm =
  document.forms["checkout-form"] || document.querySelector(".checkout-form");

if (checkoutForm) {
  // Attach the listener directly to the form's submit event (much safer than a button click)
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault(); // This stops the page from reloading standard style

    // Check HTML5 validation before sending payload data
    const myFormStatus = checkoutForm.checkValidity();
    checkoutForm.reportValidity();

    if (myFormStatus) {
      // Trigger the asynchronous backend submission process
      // Check your CheckoutProcess.mjs file for the exact method name: checkout() or checkoutSubmit()
      if (typeof myCheckout.checkoutSubmit === "function") {
        myCheckout.checkoutSubmit(e.target);
      } else {
        myCheckout.checkout(e.target);
      }
    }
  });
}
