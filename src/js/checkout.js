import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// This initializes layouts smoothly
loadHeaderFooter();

// Instatiate the checkout class wrapper
// It will use the standard 'so-cart localStorage key and will target the #order-summary element
const myCheckout = new CheckoutProcess("so-cart", "#order-summary");

// We initialize subtotal calculations when the DOM finishes loading
document.addEventListener("DOMContentLoaded", () => {
    myCheckout.init();
});

// We listen for the zip code entry to calculate tax, shipping, and final totals
const zipInput = document.getElementById("zip");

if (zipInput) {
    // When we use the 'blur' event triggers the math right when the user tabs out or clicks away from the zip input
     zipInput.addEventListener("blur", () => {
        if (zipInput.checkValidity() && zipInput.value.trim() !== "") {
            myCheckout.calculateOrdertotal();
        }
     });
}

// NEW STAGE LISTENER: Intercept the form submission to send data to the API
const checkoutForm = document.forms["checkout-form"];

if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault(); // This stops the page from reloading standard style

        // Check HTML5 validation before sending payload data
        const myFromStatus = checkoutForm.checkValidity();
        checkoutForm.reportValidity();

        if (myFromStatus) {
            // This triggers the asynchronius backend submission process
            myCheckout.checkoutSubmit(e.target);
        }
    });
}