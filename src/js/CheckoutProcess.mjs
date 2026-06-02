import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

// Convert a standard form element into a clean key-value object pair
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

// Packages the raw local storage list into the exact order-item structure expected by the server API
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity || 1,
  }));
}

export default class CheckoutProcess {
  constructor() {
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  // Reads data from LocalStorage and triggers calculation
  init() {
    this.list = getLocalStorage("so-cart") || [];
    this.calculateItemSummary();
  }

  // Method to calculate and display the total amount of the items in the cart
  calculateItemSummary() {
    const summaryElement = document.querySelector("#cartTotal");
    const itemNumElement = document.querySelector("#num-items");
    
    if (itemNumElement) {
      itemNumElement.innerText = this.list.length;
    }

    // Sum up (Price * Quantity) for all items in the array
    this.itemTotal = this.list.reduce((sum, item) => {
      const price = Number(item.FinalPrice) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }, 0);

    if (summaryElement) {
      summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  // Method to calculate tax, shipping, and the total (Using clean camelCase capitalization)
  calculateOrderTotal() {
    // Calculate Tax: 6% sales tax on the subtotal amount
    this.tax = this.itemTotal * 0.06;

    // Calculate Shipping: $10 for the first item + $2 for each extra item
    const totalItemCount = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (totalItemCount > 0) {
      this.shipping = 10 + (totalItemCount - 1) * 2;
    } else {
      this.shipping = 0;
    }

    // Find the final combined order total
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    // Display values to the page
    this.displayOrderTotals();
  }

  // Helper method to write numbers cleanly to the summary block UI elements
  displayOrderTotals() {
    const taxDisplay = document.querySelector("#tax");
    const shippingDisplay = document.querySelector("#shipping");
    const orderTotalDisplay = document.querySelector("#orderTotal");

    if (taxDisplay) taxDisplay.innerText = `$${this.tax.toFixed(2)}`;
    if (shippingDisplay) shippingDisplay.innerText = `$${this.shipping.toFixed(2)}`;
    if (orderTotalDisplay) orderTotalDisplay.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  // Handles submitting form payload data and catching custom validation error blocks
  async checkout(formElement) {
    const orderPayload = formDataToJSON(formElement);

    // Supplement object with extra metadata properties required by the server API
    orderPayload.orderDate = new Date().toISOString();
    orderPayload.orderTotal = Number(this.orderTotal.toFixed(2));
    orderPayload.tax = Number(this.tax.toFixed(2));
    orderPayload.shipping = Number(this.shipping.toFixed(2));
    orderPayload.items = packageItems(this.list);

    console.log("Submitting Payload to Server:", orderPayload);

    // Clear out old existing alert banners from a previous submission attempt
    const existingAlerts = document.querySelectorAll(".alert");
    existingAlerts.forEach(alert => alert.remove());

    try {
      const res = await services.checkout(orderPayload);
      console.log("Order placed successfully:", res);
      
      // Clear cart from local storage on successful submission
      setLocalStorage("so-cart", []);
      
      // Redirect user to success splash confirmation page
      location.assign("/checkout/success.html");
    } catch (err) {
      console.error("Checkout error fallback block:", err);

      // Handle custom error response parsing seamlessly
      if (typeof err === "object" && err !== null) {
        const messages = Object.values(err).join("<br>");
        alertMessage(messages);
        return;
    }

      if (typeof err.message === "string") {
        alertMessage(`ERROR: ${err.message}`);
        return;
      }

      alertMessage("Oops! Something went wrong with your order. Please check your data and try again.");
    }
  }
}