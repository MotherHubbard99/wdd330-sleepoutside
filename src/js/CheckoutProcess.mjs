// Import function to read data from localStorage
import { getLocalStorage } from "./utils.mjs";
// Import class that handles API calls to the backend
import ExternalServices from "./ExternalServices.mjs";

// Create a single instance of ExternalServices to use for API requests
const services = new ExternalServices();

// Helper function: converts HTML form data into a plain JavaScript object
function formDataToJSON(formElement) {
  // Create FormData object from the form element
  const formData = new FormData(formElement);
  const convertedJSON = {};
  // Loop through each form field and add it to the object
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

// Helper function: converts cart items into the format the API expects
function packageItems(items) {
  const simplifiedItems = items.map((item) => {
    console.log(item); // Log each item for debugging
    return {
      id: item.Id, // Product ID
      price: item.FinalPrice, // Product price
      name: item.Name, // Product name
      quantity: 1, // Default quantity to 1
    };
  });
  return simplifiedItems;
}

// Main class that handles the checkout logic
export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key; // localStorage key where cart is stored, e.g. "so-cart"
    this.outputSelector = outputSelector; // CSS selector for the order summary section
    this.list = []; // Array to hold cart items
    this.itemTotal = 0; // Sum of all item prices
    this.shipping = 0; // Calculated shipping cost
    this.tax = 0; // Calculated tax amount
    this.orderTotal = 0; // Final total: items + tax + shipping
  }

  // Called once when checkout page loads
  init() {
    // Load cart items from localStorage using the key
    this.list = getLocalStorage(this.key);
    // Calculate and display item count and subtotal
    this.calculateItemSummary();
  }

  // Calculate subtotal and number of items, then display them
  calculateItemSummary() {
    // Select the element that shows total price of items
    const summaryElement = document.querySelector(
      this.outputSelector + " #cartTotal"
    );
    // Select the element that shows number of items
    const itemNumElement = document.querySelector(
      this.outputSelector + " #num-items"
    );
    // Display the number of items in cart
    itemNumElement.innerText = this.list.length;
    // Get an array of all item prices
    const amounts = this.list.map((item) => item.FinalPrice);
    // Sum up all prices to get subtotal
    this.itemTotal = amounts.reduce((sum, item) => sum + item);
    // Display subtotal with 2 decimal places
    summaryElement.innerText = `$${this.itemTotal}`;
  }

  // Calculate tax, shipping, and final order total
  calculateOrderTotal() {
    // Tax is 6% of item total
    this.tax = (this.itemTotal * 0.06);
    // Shipping: $10 for first item, $2 for each additional item
    this.shipping = 10 + (this.list.length - 1) * 2;
    // Add everything together for final total
    this.orderTotal = (
      parseFloat(this.itemTotal) +
      parseFloat(this.tax) +
      parseFloat(this.shipping)
    );
    // Update the HTML with new tax, shipping, and total values
    this.displayOrderTotals();
  }

  // Display calculated tax, shipping, and total in the DOM
  displayOrderTotals() {
    // Select elements for tax, shipping, and total
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

    // Set text content with 2 decimal places
    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  // Submit the order to the backend API
  async checkout() {
    // Get the form element with name="checkout"
    const formElement = document.forms["checkout"];
    // Convert form data to JSON object
    const order = formDataToJSON(formElement);

    // Add calculated values and metadata to the order object
    order.orderDate = new Date().toISOString(); // Current date/time
    order.orderTotal = this.orderTotal;
    order.tax = this.tax;
    order.shipping = this.shipping;
    order.items = packageItems(this.list); // Add simplified cart items

    try {
      // Send order to backend using ExternalServices
      const response = await services.checkout(order);
      console.log(response); // Log success response
    } catch (err) {
      console.log(err); // Log any errors
    }
  }
}