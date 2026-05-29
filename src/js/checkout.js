import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs"; // remove {} if it's default export
console.log("checkout page is working");
loadHeaderFooter();



const order = new CheckoutProcess();
order.init();

// Recalculate when zip loses focus
document.querySelector("#zip").addEventListener("blur", () => {
  order.calculateOrderTotal();
});

// Submit the form
document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  const form = document.querySelector(".checkout-form");
  
  if (!form.checkValidity()) {
    form.reportValidity(); // shows the red outline + error message
    return; // stop here if invalid
  }

  e.preventDefault(); // only prevent default if form is valid
  order.checkout(form);
});